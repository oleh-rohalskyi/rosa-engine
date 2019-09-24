# Documentation

## Back End 1.0

### Instalation 1.1

- [ ] Create instalation file

### Enviroment 1.1

Console:

- start server `node start.js`
 with out config return error `out of config`.
- `--env=dev` development mode.
 `--env=prod` prodaction mode.
  - default: error;
- `--db_mock=use` use mock files instead of db.
  - default: use;
- `--db_mock=use,update` update mocks from db, and use it.
- `--secret=` set custom secret for auth, if not seted server will automaticaly generate ~random hash.
- `--role=` set custom role fore a user, if role not exist will be setted `guest`.
- `--port=` port default is 3001.

Programmatical on start hook second argument can resive env params by `config.development` or alis 'config.d`.

## Front End 2.0
