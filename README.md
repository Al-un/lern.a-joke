- Create a simple React application
  - create react app
  - add pure component with default props
  - add proptypes check
  - add redux+saga (using `fetch`)
  - styled-components

Focus on lerna + yarn workspace

## Create a Chuck Norris application

Let's start with a basic application relying the [Internet Chuck Norris Database](http://www.icndb.com/)
which will display some jokes. This is cool but let's say I want to
create another joke application based on another API. It would be a waste of time
to recreate all components hence the need of sharing compornents.

I will not dive into details as React / Redux are not the main focus here. Let's
start with a `create-react-app chucknorrisapp`. The folder structure is not
really canonical:

- chucknorrisapp
  - public
  - src
    - _components_: React components
    - _redux_: Redux and Saga
    - _styles_: miscellaneous style related code
  - _App.js_: our main entry points

My development steps were roughly:

1. Create pure components.
   - Add PropTypes for type checking
   - To display something, I added default props values
2. Adding Redux and Saga
   - Redux will handle the jokes list
   - Saga is chosen for asynchronous data loading. I use the `fetch` standard
   - Using ducks
3. Connect Redux to components
   - Jokes are loaded on component mount
   - "Reload" button can reload jokes
4. So far, it is very ugly. Add `styled-components`
   - There is style optimisation (mixins-like)
   - Basic responsiveness based on flexbox

## Lerna

### Initialisation

Let's add [Lerna](https://lernajs.io/). Before that, move to _chucknorrisapp_ parent
folder and make sure that the root folder is a git repository.

```sh
# If the repo is not initialised
git init
# Init project
yarn init
# Add lerna
yarn add --dev lerna
# Init
npx lerna init --independent
```

Update root `package.json` to use [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/):

```json
{
  "workspaces": ["packages/*"]
}
```

Update `lerna.json` to let Lerna know that we are using Yarn with Yarn workspaces:

```json
{
  "packages": ["packages/*"],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

Move the `chucknorrisapp` folder into `packages/` and add the start script in
root _package.json_: `"start:chuck": "cd packages/chucknorrisapp && yarn start"`

### Common dependencies

Although we have not started the shared components, we know that there are shared
dependencies.

- Remove dependencies from _chucknorrisapp_:
  - `yarn remove react react-dom styled-components`
- Add it to the root _package.json_:
  - `yarn add -W --dev react react-dom styled-components`
- Add a [_lerna:clean_](https://github.com/lerna/lerna/tree/master/commands/clean) at the root _package.json_:
  - `"lerna:clean": "lerna clean"`
- Clean `node_modules` folders and reinstall dependencies:
  - `yarn run lerna:clean --yes`
  - `yarn`
  - Ensure things are still works: `yarn run start:chuck`

### Shared components

Time to isolate some pure component such as `Joke` or `JokeList`.

- Add a new package: `npx lerna create shared-components`. Answer the questions
  and make sure that _main_ value is: `"main": "dist/index.js"`.
- I personally delete the `__test__` and `lib` folder and create an `src` folder.
- Folder structure is:
  - _src/index.js_: exporting all shared elements
  - _src/components/_: shared components
  - _src/redux/_: shared redux elements
  - _src/styles/_: shared styles elements

Let's start with the easy one: joke ducks. All jokes application will need to
fetch jokes so it is common. Create a `src/redux/joke.ducks.js` and copy the
content from the file with the same name from `chucknorrisapp`

Proceed similarly with `src/components/Joke.js` and `src/components/JokeList.js`
except that only pure components are shared. Do not copy Redux related code.

Do it also for `src/styles/index.js`.

> As components are re-exported, do not rely on `export default` and make sure
> that all required elements are exported.

Export everything in `src/index.js`:

```js
export { Joke } from './components/Joke';
export { JokeList } from './components/JokeList';
export {
  JOKE_REQUEST,
  JOKE_LOADED,
  JOKE_CLEAR,
  requestJokes,
  clearJokes,
  jokeReducer
} from './redux/joke.ducks';
```

You need first to babel-transpile such components before using it in the ChuckNorrisApp.
Time to add some dependencies on _shared-components_:

- The babel team
  ```
  yarn add --dev @babel/cli @babel/core @babel/preset-env @babel/preset-react
  ```
- Add a `shared-components/.babelrc`:
  ```json
  {
    "presets": ["@babel/preset-env", "@babel/preset-react"]
  }
  ```
- The testing team:
  ```
  yarn add --dev jest babel-jest enzyme enzyme-adapter-react-16
  ```
- For convenience, add this to the root _package.json_:
  ```
  yarn add --dev -W del-cli
  ```
- Add the following scripts in shared-components _package.json_:
  ```json
  {
    "scripts": {
      "prebuild": "del-cli dist",
      "build": "babel src -d dist --ignore \"src/**/*.spec.js\",\"src/**/*.stories.js\"",
      "test": "jest"
    }
  }
  ```
  We are not writing test files nor stories files yet. You can also add those
  scripts in the root _package.json_ for convenience:
  ```json
  {
    "scripts:" {
      "prebuild": "lerna exec --parallel -- del-cli dist",
      "build": "lerna exec --scope shared-components -- babel src -d dist --ignore \"src/**/*.spec.js\",\"src/**/*.stories.js\""
    }
  }
  ```
- For the tests we are going to write, add Jest setup in _package.json_:

  ```json
  {
    "jest": {
      "setupFiles": ["setupJest.js"]
    }
  }
  ```

  add create a `shared-components/setupJest.js`:

  ```js
  const enzyme = require('enzyme');
  const Adapter = require('enzyme-adapter-react-16');
  enzyme.configure({ adapter: new Adapter() });
  ```

  > About `setupJest.js`:
  >
  > - `require` syntax is used to avoid requiring transpiling this file
  > - File is located at the root of the packages instead of the root of the
  >   project. This is debatable as such file can be defined at the root of the
  >   workspace. If doing so, then all test related dependencies must be moved
  >   at root workspace level

- Check that babel is working: `yarn build`. Output should look like:
  ```
  $ del-cli dist
  $ babel src -d dist --ignore "src/**/*.spec.js","src/**/*.stories.js"
  Successfully compiled 4 files with Babel.
  Done in 1.96s.
  ```

### Using shared components

Let's go back to our ChuckNorrisApp:

- Remove `src/components/Joke.js`
- In `src/components/JokeList.js`, remove `PureJokeList` and import in from `shared-components`:

  ```js
  import { connect } from 'react-redux';
  import { JokeList, requestJokes } from 'shared-components';

  const mapStateToProps = state => ({ jokes: state.jokes });

  const mapDispatchToProps = dispatch => {
    return {
      load: () => dispatch(requestJokes())
    };
  };

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(JokeList);
  ```

- Similarly, in `src/redux/configureStore.js`, use the shared `jokeReducer` and delete `src/redux/joke.ducks.js`:

  ```js
  import { createStore, applyMiddleware } from 'redux';
  import createSagaMiddleware from 'redux-saga';

  import { jokeReducer } from 'shared-components';
  import jokeSagas from './joke.sagas';

  const sagaMiddleware = createSagaMiddleware();

  // init Redux store
  const store = createStore(jokeReducer, applyMiddleware(sagaMiddleware));

  // Run Sagas
  sagaMiddleware.run(jokeSagas);

  export default store;
  ```
  Don't forget to update `joke.sagas.js` as well:
  ```diff
  - import { JOKE_LOADED, JOKE_REQUEST, JOKE_CLEAR } from './joke.ducks';
  + import { JOKE_LOADED, JOKE_REQUEST, JOKE_CLEAR } from 'shared-components';
  ```

- `src/styles/index.js` can be removed
- Fasten your seat belt, `yarn start` and :tada: :tada:
