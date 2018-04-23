<a name="2.2.0"></a>
# [2.2.0](https://github.com/dylanfoster/parch/compare/2.1.2...2.2.0) (2018-04-23)


### Features

* **application:** make data layer optional ([8f9a2dc](https://github.com/dylanfoster/parch/commit/8f9a2dc)), closes [#76](https://github.com/dylanfoster/parch/issues/76)



<a name="2.1.1"></a>
## [2.1.1](https://github.com/dylanfoster/parch/compare/2.1.0...2.1.1) (2017-11-20)


### Bug Fixes

* **controller:** guard against empty model ([032f57a](https://github.com/dylanfoster/parch/commit/032f57a))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/dylanfoster/parch/compare/2.0.0...2.1.0) (2017-11-12)


### Features

* **router:** add support for nested non crud controllers ([cd6b085](https://github.com/dylanfoster/parch/commit/cd6b085))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/dylanfoster/parch/compare/1.3.2...2.0.0) (2017-11-12)


### Bug Fixes

* **handlers:** move afterModel hook to after model hook (#67) ([f6042bf](https://github.com/dylanfoster/parch/commit/f6042bf))


### Features

* **controllers:** add support for controller directories ([ee524b9](https://github.com/dylanfoster/parch/commit/ee524b9)), closes [#44](https://github.com/dylanfoster/parch/issues/44)
* **logging:** move logger under logging options and remove log option ([b668427](https://github.com/dylanfoster/parch/commit/b668427)), closes [#42](https://github.com/dylanfoster/parch/issues/42)
* **middleware:** remove info log from log middleware ([c500a73](https://github.com/dylanfoster/parch/commit/c500a73)), closes [#56](https://github.com/dylanfoster/parch/issues/56)
* **orm:** update sequelize ([38c38c5](https://github.com/dylanfoster/parch/commit/38c38c5))
* remove deprecations ([87adb2c](https://github.com/dylanfoster/parch/commit/87adb2c))


### BREAKING CHANGES

* `controller.model` has been moved to `controller.internalModel`
* controller finders have been removed. users will
need to use the store.
* `application.modelManager` has been removed,
* `application.app` has been moved to a getter
* **logging:** Users will need to move their options.log to options.logging.logger
* **orm:** updates the underlying sequelize orm. Users will need
to follow the deprecation guide
http://docs.sequelizejs.com/manual/tutorial/upgrade-to-v4.html


<a name="1.3.2"></a>
## [1.3.2](https://github.com/dylanfoster/parch/compare/1.3.1...1.3.2) (2017-11-12)


### Bug Fixes

* **application:** add guard for missing initializer directory ([0538c76](https://github.com/dylanfoster/parch/commit/0538c76))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/dylanfoster/parch/compare/1.3.0...1.3.1) (2017-10-25)


### Features

* **serializers:** update docs for default and fix import ([6b5cbb5](https://github.com/dylanfoster/parch/commit/6b5cbb5))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/dylanfoster/parch/compare/1.2.0...1.3.0) (2017-10-24)


### Features

* **serializers:** add RestSerializer ([0cfca6a](https://github.com/dylanfoster/parch/commit/0cfca6a))
* **store:** add json serializer ([77406aa](https://github.com/dylanfoster/parch/commit/77406aa))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/dylanfoster/parch/compare/1.1.1...1.2.0) (2017-10-19)


### Features

* **application:** add support for project initializers ([dfbacab](https://github.com/dylanfoster/parch/commit/dfbacab))
* **loader:** remove type suffix from module name ([3e8c2f3](https://github.com/dylanfoster/parch/commit/3e8c2f3))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/dylanfoster/parch/compare/1.1.0...1.1.1) (2017-04-09)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/dylanfoster/parch/compare/1.0.3...1.1.0) (2017-04-03)


### Features

* **controller:** move underlying dao methods to use dylanfoster/orm and expose via
store ([9119ba8](https://github.com/dylanfoster/parch/commit/9119ba8))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/dylanfoster/parch/compare/1.0.2...v1.0.3) (2017-03-31)

Deprecates `config.log` for 2.0.0

<a name="1.0.2"></a>
## [1.0.2](https://github.com/dylanfoster/parch/compare/1.0.1...1.0.2) (2017-03-30)


### Bug Fixes

* **logger:** ensure logger is injected whether internal or user passed ([1b41ded](https://github.com/dylanfoster/parch/commit/1b41ded)), closes [#41](https://github.com/dylanfoster/parch/issues/41) [#41](https://github.com/dylanfoster/parch/issues/41)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/dylanfoster/parch/compare/1.0.0...v1.0.1) (2017-03-18)


### Bug Fixes

* export containment from main export ([3cf5b50](https://github.com/dylanfoster/parch/commit/3cf5b50))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/dylanfoster/parch/compare/0.12.0...v1.0.0) (2017-03-18)


### Features

* **application:** move application init to initializers ([d8d7cb8](https://github.com/dylanfoster/parch/commit/d8d7cb8))
* **containment:** add containment ([07b56cc](https://github.com/dylanfoster/parch/commit/07b56cc))
* **controller:** move controller to registry ([43a99b6](https://github.com/dylanfoster/parch/commit/43a99b6))
* **initializers:** add application initializer ([00c9379](https://github.com/dylanfoster/parch/commit/00c9379))
* **initializers:** instantiate model manager ([099a3a8](https://github.com/dylanfoster/parch/commit/099a3a8))
* **initializers:** log initializers ([ba81b61](https://github.com/dylanfoster/parch/commit/ba81b61))
* **initializers:** move logger to an initializer ([4713bd1](https://github.com/dylanfoster/parch/commit/4713bd1))
* **initializers:** reorder model manager ([f375899](https://github.com/dylanfoster/parch/commit/f375899))
* **inject:** add optional property name ([fb9eee4](https://github.com/dylanfoster/parch/commit/fb9eee4))
* **registry:** add registry and initializers ([2653a71](https://github.com/dylanfoster/parch/commit/2653a71))
* **registry:** add singleton option to register ([350cc81](https://github.com/dylanfoster/parch/commit/350cc81))
* **registry:** throw an error when trying to inject unregistered object ([74d9fef](https://github.com/dylanfoster/parch/commit/74d9fef))
* **router:** move router to registry ([0175af4](https://github.com/dylanfoster/parch/commit/0175af4))
* **router:** use resource name for path segment ([3f81bb4](https://github.com/dylanfoster/parch/commit/3f81bb4)), closes [#6](https://github.com/dylanfoster/parch/issues/6)
* add deprecations ([02911b9](https://github.com/dylanfoster/parch/commit/02911b9))


### BREAKING CHANGES

* router: dynamic path segment for resources has been changed to use the
resource name e.g. :id => :userId. As a result, users using req.params.id will
need to make the update

commit f529a8a954338ba9e48ac77154cdf2b5d14780d2
Merge: ea13de9 8386f45
Author: Dylan Foster <dylan947@gmail.com>
Date:   Tue Mar 14 13:07:39 2017 -0700

    chore: rebase develop

commit ea13de969b7900d231f6cf9f74a1bd23b8b221e6
Author: Dylan Foster <dylan947@gmail.com>
Date:   Tue Mar 14 10:39:09 2017 -0700

    test(router): update controller fixture

commit d8835f05e358a9c4b7226caf2ef00b444065ab51
Author: Dylan Foster <dylan947@gmail.com>
Date:   Tue Mar 14 10:22:47 2017 -0700

    feat(router): use resource name for path segment

commit 8386f451c759baeb9dc2c95bef5daadf055f5649
Author: Dylan Foster <dylan947@gmail.com>
Date:   Tue Mar 14 10:39:09 2017 -0700

    test(router): update controller fixture

commit 305c724cfe0fc6f684e2a1a1da349ed502dd2fbc
Author: Dylan Foster <dylan947@gmail.com>
Date:   Tue Mar 14 10:22:47 2017 -0700

    feat(router): use resource name for path segment



<a name="0.12.0"></a>
# [0.12.0](https://github.com/dylanfoster/parch/compare/0.11.0...v0.12.0) (2017-03-13)


### Features

* **router:** add namespace support for resource ([0548ed5](https://github.com/dylanfoster/parch/commit/0548ed5))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/dylanfoster/parch/compare/0.10.0...v0.11.0) (2017-03-13)


### Features

* **router:** add delete method support ([07e2c96](https://github.com/dylanfoster/parch/commit/07e2c96)), closes [#25](https://github.com/dylanfoster/parch/issues/25) [#25](https://github.com/dylanfoster/parch/issues/25)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/dylanfoster/parch/compare/0.9.0...v0.10.0) (2017-02-19)


### Features

* **controller:** add finder option support ([b3f078f](https://github.com/dylanfoster/parch/commit/b3f078f)), closes [#29](https://github.com/dylanfoster/parch/issues/29) [#29](https://github.com/dylanfoster/parch/issues/29)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/dylanfoster/parch/compare/0.8.0...v0.9.0) (2017-01-17)


### Features

* **router:** add global route namespace support ([af05d88](https://github.com/dylanfoster/parch/commit/af05d88))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/dylanfoster/parch/compare/0.7.1...v0.8.0) (2017-01-08)


### Features

* **router:** add namespace support ([2065ee7](https://github.com/dylanfoster/parch/commit/2065ee7))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/dylanfoster/parch/compare/0.7.0...v0.7.1) (2017-01-07)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/dylanfoster/parch/compare/0.6.0...v0.7.0) (2017-01-07)


### Features

* **utils:** add status code constants to controller ([b82d830](https://github.com/dylanfoster/parch/commit/b82d830))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/dylanfoster/parch/compare/0.5.0...v0.6.0) (2017-01-03)


### Features

* **application:** add app instance to request object ([637e7a6](https://github.com/dylanfoster/parch/commit/637e7a6))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/dylanfoster/parch/compare/0.4.0...v0.5.0) (2017-01-01)


### Features

* **router:** add support for before and after controller hooks ([13d5f7a](https://github.com/dylanfoster/parch/commit/13d5f7a))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/dylanfoster/parch/compare/0.3.1...v0.4.0) (2016-12-27)


### Features

* **models:** add ability to pass sequelize model options ([5557116](https://github.com/dylanfoster/parch/commit/5557116))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/dylanfoster/parch/compare/0.3.0...v0.3.1) (2016-12-04)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/dylanfoster/parch/compare/0.2.0...v0.3.0) (2016-12-04)


### Features

* **application:** add ability to override logging directory and serializers ([d824fe9](https://github.com/dylanfoster/parch/commit/d824fe9))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/dylanfoster/parch/compare/0.1.0...v0.2.0) (2016-11-28)


### Features

* **app:** move logging to a middleware ([fde7ae8](https://github.com/dylanfoster/parch/commit/fde7ae8))
* **loader:** allow filter to be configurable ([61a750b](https://github.com/dylanfoster/parch/commit/61a750b))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/dylanfoster/parch/compare/v0.0.9...v0.1.0) (2016-07-13)


### Features

* **authentication:** add authentication to application ([44c7c33](https://github.com/dylanfoster/parch/commit/44c7c33))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/dylanfoster/parch/compare/0.0.7...v0.0.8) (2016-07-01)


### Features

* **logger:** add logger class ([d88b1d2](https://github.com/dylanfoster/parch/commit/d88b1d2))
* **logger:** add logger to app ([b3435ba](https://github.com/dylanfoster/parch/commit/b3435ba))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/dylanfoster/parch/compare/0.0.6...v0.0.7) (2016-06-24)


### Features

* **controller:** add ability to query with findAll ([92c8123](https://github.com/dylanfoster/parch/commit/92c8123))
* **controller:** add bad request error for updateRecord ([12dd740](https://github.com/dylanfoster/parch/commit/12dd740))
* **controller:** add createRecord method ([fccf424](https://github.com/dylanfoster/parch/commit/fccf424))
* **controller:** add destroyRecord method ([59f2fd8](https://github.com/dylanfoster/parch/commit/59f2fd8))
* **controller:** add findAll finder ([1d038c7](https://github.com/dylanfoster/parch/commit/1d038c7))
* **controller:** add findOne finder ([fab5c56](https://github.com/dylanfoster/parch/commit/fab5c56))
* **controller:** add updateRecord method ([d373618](https://github.com/dylanfoster/parch/commit/d373618))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/dylanfoster/parch/compare/0.0.5...v0.0.6) (2016-06-23)


### Features

* **router:** add route method to bind static route acitons ([88ace6f](https://github.com/dylanfoster/parch/commit/88ace6f))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/dylanfoster/parch/compare/0.0.4...v0.0.5) (2016-06-22)


### Features

* Add Sequelize support
* **application:** add default lookup paths for controllers and models and clean up constructor ([cbb5985](https://github.com/dylanfoster/parch/commit/cbb5985))
* **application:** clean up constructor some more ([3432f07](https://github.com/dylanfoster/parch/commit/3432f07))
* **models:** add base model class and pending tests ([2957baf](https://github.com/dylanfoster/parch/commit/2957baf))
* **models:** add model managaer ([7da0e24](https://github.com/dylanfoster/parch/commit/7da0e24))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/dylanfoster/parch/compare/0.0.3...v0.0.4) (2016-06-16)


### Features

* **application:** add default set of middlewares and merge with optional ([f3d3a2f](https://github.com/dylanfoster/parch/commit/f3d3a2f))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/dylanfoster/parch/compare/0.0.2...v0.0.3) (2016-06-16)


### Features

* **application:** pass through server options to restify ([daf427c](https://github.com/dylanfoster/parch/commit/daf427c))
* **loader:** ensure modules are always singularized ([ba1cb51](https://github.com/dylanfoster/parch/commit/ba1cb51))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/dylanfoster/parch/compare/0.0.1...v0.0.2) (2016-06-15)


### Features

* **application:** add start method and fix exports after compile ([d0f1670](https://github.com/dylanfoster/parch/commit/d0f1670))



<a name="0.0.1"></a>
## 0.0.1 (2016-06-15)


### Features

* **basic route mapping**
* **application:** alias application#map to Router.map ([ec4eb94](https://github.com/dylanfoster/parch/commit/ec4eb94))
* **lib:** change to es6 module syntax ([3eaaac4](https://github.com/dylanfoster/parch/commit/3eaaac4))
* **loader:** add module loader and tests ([58f7549](https://github.com/dylanfoster/parch/commit/58f7549))
* **router:** clean up controller mapping ([525de43](https://github.com/dylanfoster/parch/commit/525de43))
* **router:** wire up "resource" ([2476298](https://github.com/dylanfoster/parch/commit/2476298))



