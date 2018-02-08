## Classes

<dl>
<dt><a href="#Application">Application</a></dt>
<dd><p>Application</p>
</dd>
<dt><a href="#containment">containment</a></dt>
<dd></dd>
<dt><a href="#Controller">Controller</a></dt>
<dd><p>Controller</p>
</dd>
<dt><a href="#Loader">Loader</a></dt>
<dd><p>Loader</p>
</dd>
<dt><a href="#Model">Model</a></dt>
<dd><p>Model</p>
</dd>
<dt><a href="#ModelManager">ModelManager</a></dt>
<dd><p>ModelManager</p>
</dd>
<dt><a href="#Route">Route</a></dt>
<dd><p>Route</p>
</dd>
<dt><a href="#RouteSegment">RouteSegment</a></dt>
<dd><p>RouteSegment</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Router</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#listen">listen(port)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Starts the server</p>
</dd>
<dt><a href="#runProjectInitializers">runProjectInitializers()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Runs all consumer initializers</p>
</dd>
<dt><a href="#start">start(port)</a> ⇒ <code>Promise.&lt;undefined, Error&gt;</code></dt>
<dd><p>starts listening on the defined port</p>
</dd>
<dt><a href="#getOwner">getOwner(child)</a> ⇒ <code>Object</code></dt>
<dd><p>Get the owner of an object</p>
</dd>
<dt><a href="#setOwner">setOwner(child, parent)</a></dt>
<dd><p>Set the owner object of the child object</p>
</dd>
<dt><a href="#getModelName">getModelName(model)</a> ⇒ <code>String</code></dt>
<dd><p>Returns the name of the model that is associated with this controller.
If options.model is passed to controller it will take precedence, otherwise
the controller will attempt to lookup a model matching the controller&#39;s name</p>
</dd>
<dt><a href="#get">get(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns the loaded module object by name</p>
</dd>
<dt><a href="#define">define(DataTypes)</a></dt>
<dd><p>Model definition</p>
</dd>
<dt><a href="#addModel">addModel(Model)</a></dt>
<dd><p>Adds a model to internal cache</p>
<pre><code>class FooModel extends parch.Model {
  constructor(options) {
    super(options);
  }

  associate(Foo, models) {
  }

  define(DataTypes) {
  }
}

modelManager.addModel(Model);
</code></pre></dd>
<dt><a href="#inject">inject(context, lookup, propertyName)</a> ⇒ <code>Object</code></dt>
<dd><p>Inject an object into another object</p>
</dd>
<dt><a href="#lookup">lookup(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Find an object in the registry. If the object isn&#39;t found in the registry,
lookup will attempt to find it by requiring it in. If the require fails
the lookup fails</p>
</dd>
<dt><a href="#register">register(name, Obj, options)</a> ⇒ <code>Object</code></dt>
<dd><p>Register an object in the registry by name. If the name exists and it was
registered with the { singleton: true } option, an error will be thrown.</p>
</dd>
<dt><a href="#hasLeadingSlash">hasLeadingSlash()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Determines if a path segment contains a leading slash /</p>
</dd>
<dt><a href="#hasTrailingSlash">hasTrailingSlash()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Determines if a path segment contains a trailing slash /</p>
</dd>
<dt><a href="#_buildSegment">_buildSegment()</a> ⇒ <code>String</code></dt>
<dd><p>Builds a consistent path segment, regardless of slashes</p>
</dd>
<dt><a href="#namespace">namespace(namespace, routes)</a></dt>
<dd><p>Bind a set of routes to a namespace.
Uses {{#crossLink &quot;Router/_buildRoute:method&quot;}}_buildRoute{{/crossLink}} to
normalize the path</p>
</dd>
<dt><a href="#resource">resource(name, options)</a></dt>
<dd><p>Register a resource and wire up restful endpoints.
Uses {{#crossLink &quot;Router/_buildRoute:method&quot;}}_buildRoute{{/crossLink}} to
normalize the path and builds your 5 basic CRUD endpoints</p>
</dd>
<dt><a href="#route">route(path, options)</a></dt>
<dd><p>Register a single route.
Uses {{#crossLink &quot;Router/_buildRoute:method&quot;}}_buildRoute{{/crossLink}} to
normalize the path</p>
</dd>
<dt><a href="#createRecord">createRecord(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a record</p>
</dd>
<dt><a href="#findAll">findAll(name)</a> ⇒ <code>Array</code> | <code>Object</code></dt>
<dd><p>Returns all records. Passing an optional query will query those records.</p>
</dd>
<dt><a href="#findOne">findOne(name)</a> ⇒ <code>Array</code> | <code>Object</code></dt>
<dd><p>Returns a single record by id</p>
</dd>
<dt><a href="#queryRecord">queryRecord(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns the first record matching the passed query</p>
</dd>
<dt><a href="#updateRecord">updateRecord(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a record by id</p>
</dd>
</dl>

<a name="Application"></a>

## Application
Application

**Kind**: global class  

* [Application](#Application)
    * [new Application(options)](#new_Application_new)
    * [.app](#Application+app) : <code>Object</code>
    * [.projectDirectory](#Application+projectDirectory) : <code>String</code>

<a name="new_Application_new"></a>

### new Application(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Application config options <a href="https://parch-js.github.io">   See configuration </a> |

<a name="Application+app"></a>

### application.app : <code>Object</code>
Restify application instance

**Kind**: instance property of [<code>Application</code>](#Application)  
**Properties**

| Name |
| --- |
| app | 

<a name="Application+projectDirectory"></a>

### application.projectDirectory : <code>String</code>
The consuming project's directory

**Kind**: instance property of [<code>Application</code>](#Application)  
**Properties**

| Name |
| --- |
| projectDirectory | 

<a name="containment"></a>

## containment
**Kind**: global class  
<a name="Controller"></a>

## Controller
Controller

**Kind**: global class  
**Todo**

- [ ] add default restfull methods (index, show, etc)


* [Controller](#Controller)
    * [new Controller(registry, options)](#new_Controller_new)
    * [.errors](#Controller+errors) : <code>Object</code>
    * [.models](#Controller+models) : <code>Array</code>
    * [.modelName](#Controller+modelName) : <code>String</code>
    * [.modelNameLookup](#Controller+modelNameLookup) : <code>String</code>
    * [.STATUS_CODES](#Controller+STATUS_CODES) : <code>Object</code>

<a name="new_Controller_new"></a>

### new Controller(registry, options)

| Param | Type | Description |
| --- | --- | --- |
| registry | <code>Object</code> | module registry |
| options | <code>Object</code> | configuration options |
| options.model | <code>String</code> | override the default model name |

<a name="Controller+errors"></a>

### controller.errors : <code>Object</code>
Restify errors map
<a href="https://github.com/restify/errors">
restify-errors
</a>

**Kind**: instance property of [<code>Controller</code>](#Controller)  
**Properties**

| Name |
| --- |
| errors | 

<a name="Controller+models"></a>

### controller.models : <code>Array</code>
Object containing all models registered

**Kind**: instance property of [<code>Controller</code>](#Controller)  
**Properties**

| Name |
| --- |
| models | 

<a name="Controller+modelName"></a>

### controller.modelName : <code>String</code>
The name of the model that belongs to this controller. If one cannot be
found this will be undefined

**Kind**: instance property of [<code>Controller</code>](#Controller)  
**Properties**

| Name |
| --- |
| modelName | 

<a name="Controller+modelNameLookup"></a>

### controller.modelNameLookup : <code>String</code>
Pluralized version of modelName

**Kind**: instance property of [<code>Controller</code>](#Controller)  
**Properties**

| Name |
| --- |
| modelNameLookup | 

<a name="Controller+STATUS_CODES"></a>

### controller.STATUS_CODES : <code>Object</code>
An object mapping of status codes and their corresponding value

**Kind**: instance property of [<code>Controller</code>](#Controller)  
**Properties**

| Name |
| --- |
| STATUS_CODES | 

<a name="Loader"></a>

## Loader
Loader

**Kind**: global class  

* [Loader](#Loader)
    * [new Loader(settings)](#new_Loader_new)
    * [.type](#Loader+type) : <code>String</code>
    * [.filter](#Loader+filter) : <code>String</code>
    * [.loadPath](#Loader+loadPath) : <code>String</code>

<a name="new_Loader_new"></a>

### new Loader(settings)

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> |  |
| settings.type | <code>String</code> | the loader type (controller, model, etc) |
| settings.filter | <code>RegExp</code> | loader filter |
| settings.path | <code>String</code> | module loader path |

<a name="Loader+type"></a>

### loader.type : <code>String</code>
Loader type

**Kind**: instance property of [<code>Loader</code>](#Loader)  
**Properties**

| Name |
| --- |
| type | 

<a name="Loader+filter"></a>

### loader.filter : <code>String</code>
Loader filter

**Kind**: instance property of [<code>Loader</code>](#Loader)  
**Properties**

| Name |
| --- |
| filter | 

<a name="Loader+loadPath"></a>

### loader.loadPath : <code>String</code>
Module load path

**Kind**: instance property of [<code>Loader</code>](#Loader)  
**Properties**

| Name |
| --- |
| loadPath | 

<a name="Model"></a>

## Model
Model

**Kind**: global class  

* [Model](#Model)
    * [new Model(options)](#new_Model_new)
    * [.options](#Model+options) : <code>Object</code>

<a name="new_Model_new"></a>

### new Model(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | sequelize model options <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration" target="_blank">   Sequelize Configuration </a> |

<a name="Model+options"></a>

### model.options : <code>Object</code>
Model options get passed directly to sequelize model definition. The main
difference is the separation of model constructor options and model
attribute definitions.

<a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/" target="_blank">
  see http://docs.sequelizejs.com/en/v3/docs/models-definition/
</a>

**Kind**: instance property of [<code>Model</code>](#Model)  
**Properties**

| Name |
| --- |
| options | 

<a name="ModelManager"></a>

## ModelManager
ModelManager

**Kind**: global class  

* [ModelManager](#ModelManager)
    * [new ModelManager(settings)](#new_ModelManager_new)
    * [.Sequelize](#ModelManager+Sequelize) : <code>Object</code>
    * [.sequelize](#ModelManager+sequelize) : <code>Object</code>

<a name="new_ModelManager_new"></a>

### new ModelManager(settings)

| Param | Type |
| --- | --- |
| settings | <code>Object</code> | 
| settings.connection | <code>Object</code> | 

<a name="ModelManager+Sequelize"></a>

### modelManager.Sequelize : <code>Object</code>
Sequelize class

**Kind**: instance property of [<code>ModelManager</code>](#ModelManager)  
**Properties**

| Name |
| --- |
| Sequelize | 

<a name="ModelManager+sequelize"></a>

### modelManager.sequelize : <code>Object</code>
Sequelize instance

**Kind**: instance property of [<code>ModelManager</code>](#ModelManager)  
**Properties**

| Name |
| --- |
| sequelize | 

<a name="Route"></a>

## Route
Route

**Kind**: global class  

* [Route](#Route)
    * [new Route()](#new_Route_new)
    * [.path](#Route+path) : <code>String</code>
    * [.segments](#Route+segments) : <code>Array</code>

<a name="new_Route_new"></a>

### new Route()
**Returns**: <code>Object</code> - path object  

| Param | Type |
| --- | --- |
| ...segment | <code>String</code> | 

**Example**  
```javascript
new Route("foo", "/bar", "baz/");
/**
 * {
 *   path: "/foo/bar/baz"
 *   segments: [
 *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}},
 *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}},
 *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}}
 *   ]
 * }
 *
```
<a name="Route+path"></a>

### route.path : <code>String</code>
The path is the fully built path from segments e.g. /foo/bar/baz

**Kind**: instance property of [<code>Route</code>](#Route)  
**Properties**

| Name |
| --- |
| path | 

<a name="Route+segments"></a>

### route.segments : <code>Array</code>
All segments that make up this route. Consists of an array of {{#crossLink "RouteSegment"}}RouteSegments{{/crossLink}}

**Kind**: instance property of [<code>Route</code>](#Route)  
**Properties**

| Name |
| --- |
| segments | 

<a name="RouteSegment"></a>

## RouteSegment
RouteSegment

**Kind**: global class  

* [RouteSegment](#RouteSegment)
    * [new RouteSegment(segment)](#new_RouteSegment_new)
    * [.segment](#RouteSegment+segment) : <code>String</code>
    * [.path](#RouteSegment+path) : <code>String</code>

<a name="new_RouteSegment_new"></a>

### new RouteSegment(segment)

| Param | Type | Description |
| --- | --- | --- |
| segment | <code>String</code> | A single route segment |

**Example**  
```javascript
new RouteSegment("/foo"); => { path: "/foo", segment: "/foo" }
new RouteSegment("foo"); => { path: "/foo", segment: "foo" }
new RouteSegment("/foo/"); => { path: "/foo", segment: "/foo/" }
new RouteSegment("foo/"); => { path: "/foo", segment: "foo/" }
```
<a name="RouteSegment+segment"></a>

### routeSegment.segment : <code>String</code>
Segment represents the original path segment that was passed in

**Kind**: instance property of [<code>RouteSegment</code>](#RouteSegment)  
**Properties**

| Name |
| --- |
| segment | 

<a name="RouteSegment+path"></a>

### routeSegment.path : <code>String</code>
The normalized path segment after removing/adding slashes

**Kind**: instance property of [<code>RouteSegment</code>](#RouteSegment)  
**Properties**

| Name |
| --- |
| path | 

<a name="Router"></a>

## Router
Router

**Kind**: global class  

* [Router](#Router)
    * [new Router(registry)](#new_Router_new)
    * _instance_
        * [.loader](#Router+loader) : <code>Object</code>
        * [.namespacePrefix](#Router+namespacePrefix) : <code>String</code>
    * _static_
        * [.map(settings, callback)](#Router.map) ⇒ <code>undefined</code>

<a name="new_Router_new"></a>

### new Router(registry)

| Param | Type | Description |
| --- | --- | --- |
| registry | <code>Object</code> | {{#crossLink "Registry"}}module registry{{/crossLink}} |

<a name="Router+loader"></a>

### router.loader : <code>Object</code>
Contains the model and controller {{#crossLink "Loader"}}loaders{{/crossLink}}

**Kind**: instance property of [<code>Router</code>](#Router)  
**Properties**

| Name |
| --- |
| loader | 

<a name="Router+namespacePrefix"></a>

### router.namespacePrefix : <code>String</code>
An optional namespace to place before all routes (e.g. /v1)

**Kind**: instance property of [<code>Router</code>](#Router)  
**Properties**

| Name |
| --- |
| namespacePrefix | 

<a name="Router.map"></a>

### Router.map(settings, callback) ⇒ <code>undefined</code>
configures router resources

**Kind**: static method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> |  |
| callback | <code>function</code> | called with the router instance |

<a name="listen"></a>

## listen(port) ⇒ <code>Promise.&lt;void&gt;</code>
Starts the server

**Kind**: global function  

| Param | Type |
| --- | --- |
| port | <code>Number</code> | 

<a name="runProjectInitializers"></a>

## runProjectInitializers() ⇒ <code>Promise.&lt;void&gt;</code>
Runs all consumer initializers

**Kind**: global function  
<a name="start"></a>

## start(port) ⇒ <code>Promise.&lt;undefined, Error&gt;</code>
starts listening on the defined port

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | the port to listen on. Default: 3000 |

<a name="getOwner"></a>

## getOwner(child) ⇒ <code>Object</code>
Get the owner of an object

**Kind**: global function  
**Returns**: <code>Object</code> - parent (owner)  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Object</code> | object from which to fetch the parent |

**Example**  
```javascript
class UserController extends parch.Controller {
  doStuff(req, res, next) {
    const store = getOwner(this).lookup("service:store");

    return store.findAll();
  }
}
```
<a name="setOwner"></a>

## setOwner(child, parent)
Set the owner object of the child object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Object</code> | child object |
| parent | <code>Object</code> | parent (owner) object |

**Example**  
```javascript
setOwner({}, "service:store", "store");

{}.store
```
<a name="getModelName"></a>

## getModelName(model) ⇒ <code>String</code>
Returns the name of the model that is associated with this controller.
If options.model is passed to controller it will take precedence, otherwise
the controller will attempt to lookup a model matching the controller's name

**Kind**: global function  
**Returns**: <code>String</code> - modelName  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>String</code> | name of the model to use |

<a name="get"></a>

## get(name) ⇒ <code>Object</code>
Returns the loaded module object by name

**Kind**: global function  
**Returns**: <code>Object</code> - module object  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="define"></a>

## define(DataTypes)
Model definition

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| DataTypes | <code>Object</code> | sequelize DataTypes Object <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types" target="_blank">   See Sequelize DataTypes </a> |

**Example**  
```javascript
define(DataTypes) {
  const user = {
    username: {
      allowNull: false
      type: DataTypes.STRING
    }
  };

  return user;
}
```
<a name="addModel"></a>

## addModel(Model)
Adds a model to internal cache

    class FooModel extends parch.Model {
      constructor(options) {
        super(options);
      }

      associate(Foo, models) {
      }

      define(DataTypes) {
      }
    }

    modelManager.addModel(Model);

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Model | <code>Object</code> | parch model class |

<a name="inject"></a>

## inject(context, lookup, propertyName) ⇒ <code>Object</code>
Inject an object into another object

**Kind**: global function  
**Returns**: <code>Object</code> - context  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | the object to inject onto |
| lookup | <code>String</code> | name by which to look search for the injection in the registry |
| propertyName | <code>String</code> | optional property name of the newly injected object |

**Example**  
```javascript
registry.inject(object, "service:store");
// object.store

registry.inject(object, "service:model-manager", "modelManager");
// object.modelManager
```
<a name="lookup"></a>

## lookup(name) ⇒ <code>Object</code>
Find an object in the registry. If the object isn't found in the registry,
lookup will attempt to find it by requiring it in. If the require fails
the lookup fails

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | colon delimited lookup string "service:foo" |

**Example**  
```javascript
registry.lookup("service:foo");
```
<a name="register"></a>

## register(name, Obj, options) ⇒ <code>Object</code>
Register an object in the registry by name. If the name exists and it was
registered with the { singleton: true } option, an error will be thrown.

**Kind**: global function  
**Returns**: <code>Object</code> - Obj  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name by which to register the object |
| Obj | <code>Object</code> | the object to store in the registry |
| options | <code>Object</code> | register options |
| options.instantiate | <code>Boolean</code> | instantiate the object when registering it |
| options.singleton | <code>Boolean</code> | only allow one registration of this name/object |

**Example**  
```javascript
registry.register("service:foo", { foo: "bar" });
```
<a name="hasLeadingSlash"></a>

## hasLeadingSlash() ⇒ <code>Boolean</code>
Determines if a path segment contains a leading slash /

**Kind**: global function  
**Example**  
```javascript
new RouteSegment("foo").hasLeadingSlash(); => false
new RouteSegment("foo/").hasLeadingSlash(); => false
new RouteSegment("/foo/").hasLeadingSlash(); => true
new RouteSegment("/foo").hasLeadingSlash(); => true
```
<a name="hasTrailingSlash"></a>

## hasTrailingSlash() ⇒ <code>Boolean</code>
Determines if a path segment contains a trailing slash /

**Kind**: global function  
**Example**  
```javascript
new RouteSegment("foo").hasTrailingSlash(); => false
new RouteSegment("/foo").hasTrailingSlash(); => false
new RouteSegment("/foo/").hasTrailingSlash(); => true
new RouteSegment("foo/").hasTrailingSlash(); => true
```
<a name="_buildSegment"></a>

## _buildSegment() ⇒ <code>String</code>
Builds a consistent path segment, regardless of slashes

**Kind**: global function  
**Returns**: <code>String</code> - path segment  
<a name="namespace"></a>

## namespace(namespace, routes)
Bind a set of routes to a namespace.
Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
normalize the path

**Kind**: global function  
**Since**: 0.9.0  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | the namespace to bind to, with or without leading slash |
| routes | <code>Array.&lt;Object&gt;</code> | array of routes to bind to the namespace |

**Example**  
```javascript
Router.map(function () {
  this.namespace("/users/:userId", [
    { path: "/setProfileImage", using: "user:setImage", method: "post" }
  ])
});
```
<a name="resource"></a>

## resource(name, options)
Register a resource and wire up restful endpoints.
Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
normalize the path and builds your 5 basic CRUD endpoints

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the resource name in singular form |
| options | <code>Object</code> | resource mapping options |
| options.namespace | <code>String</code> | mount the resource endpoint under a namespace |

**Example**  
```javascript
Router.map(function () {
  this.resource("user");

  // Optionally prefix this resource with a namespace
  this.resource("user", { namespace: "api" })
});
```
<a name="route"></a>

## route(path, options)
Register a single route.
Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
normalize the path

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | the route path (e.g. /foo/bar) |
| options | <code>Object</code> |  |
| options.using | <code>String</code> | colon delimited controller method identifier |
| options.method | <code>String</code> | http method |

**Example**  
```javascript
Router.map(function () {
  this.route("/user/foo", { using: "users:foo", method: "get" });
});
```
<a name="createRecord"></a>

## createRecord(name) ⇒ <code>Object</code>
Creates a record

**Kind**: global function  
**Returns**: <code>Object</code> - seralized record instance  

| Param |
| --- |
| name | 

**Example**  
```javascript
return store.createRecord("user", {
  firstName: "hank",
  lastName: "hill"
});
```
<a name="findAll"></a>

## findAll(name) ⇒ <code>Array</code> \| <code>Object</code>
Returns all records. Passing an optional query will query those records.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - serialized record arry  

| Param |
| --- |
| name | 

**Example**  
```javascript
return store.findAll("user");

return store.findAll("user", {
  firstName: "Jon"
})
```
<a name="findOne"></a>

## findOne(name) ⇒ <code>Array</code> \| <code>Object</code>
Returns a single record by id

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - serialized record array  

| Param |
| --- |
| name | 

**Example**  
```javascript
return store.findOne("user", 1);
```
<a name="queryRecord"></a>

## queryRecord(name) ⇒ <code>Object</code>
Returns the first record matching the passed query

**Kind**: global function  
**Returns**: <code>Object</code> - serialized record instance  

| Param |
| --- |
| name | 

**Example**  
```javascript
return store.queryRecord("user", {
  firstName: "jon"
})
```
<a name="updateRecord"></a>

## updateRecord(name) ⇒ <code>Object</code>
Updates a record by id

**Kind**: global function  
**Returns**: <code>Object</code> - seralized record instance  

| Param |
| --- |
| name | 

**Example**  
```javascript
return store.updateRecord("user", 1, { firstName: "Jane" });
```
