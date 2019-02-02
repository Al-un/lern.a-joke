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
  - `yarn add -W react react-dom styled-components`
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
