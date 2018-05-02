# Center for Hellenic Studies Text Server 

[![pipeline status](http://gitlab.archimedes.digital/archimedes/graphql-textserver/badges/develop/pipeline.svg)](http://gitlab.archimedes.digital/archimedes/graphql-textserver/commits/develop)
[![coverage report](http://gitlab.archimedes.digital/archimedes/graphql-textserver/badges/develop/coverage.svg)](http://gitlab.archimedes.digital/archimedes/graphql-textserver/commits/develop)

For Developers:
---
To setup development workspace:

0. [get the code] clone this repo && checkout branch `develop` && `yarn install`
1. [setup your local DB] install `postgres` and setup user
2. [setup env vars for test] changes you need to make in `.env.test`: { `DB_HOST` = your postgres host, eg. localhost; `DB_USER` = your postgres user, eg. postgres;}
3. [provision your local test DB] run `yarn db:ingest:test`
4. [test to see if everything is working] run `yarn test`
5. [setup env vars for dev] changes you need to make in `.env.development`: { `DB_USER` = your postgres user, eg. postgres; `DB_PASS` = your postgres password; }
6. [run app locally] `yarn start`
