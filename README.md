isis-angularjs-simpleapp
========================

This project combines [Apache Isis](http://isis.apache.org) [SimpleApp archetype 1.6.0](http://isis.apache.org/intro/getting-started/simpleapp-archetype.html) 
and also the [AngularJS seed app](https://github.com/angular/angular-seed), to get started hacking using Isis' 
implementation of the [Restful Objects](http://restfulobjects.org) v1.0 spec.

## To start:

Use `npm` to bring down dependencies (they aren't checked into the git repo):

    cd webapp/src/main/webapp/angular
    npm install
    
Might need to run this command twice (at least, I did on Windows).

The example as committed demonstrates CORS support by hard-coding the URL (in `webapp/src/main/webapp/angular/app/controllers.js`:

      url: 'http://halyogatp:8080/restful/services/'

Change hostname as required.

To run the example without a requirement for CORS being configured, change to a relative URL:

      url: '/restful/services/'
      
Either way, when browse to: http://localhost:8080/angular/app/index.html

Should see something like:

![](https://raw.github.com/danhaywood/isis-angularjs-simpleapp/master/images/w00t.png)


## Notes

This remainder of this `README` just captures how I got to this point...

### initial seed

Copied down a default `.gitignore`
* ignore Java classes and archives, IDE project files etc.

Create Isis simple app from archetype:

    mvn archetype:generate  \
        -D archetypeGroupId=org.apache.isis.archetype \
        -D archetypeArtifactId=simpleapp-archetype \
        -D archetypeVersion=1.6.0 \
        -D groupId=com.danhaywood.isis.angularjs.simpleapp \
        -D artifactId=isis-angularjs-simpleapp \
        -D version=1.0-SNAPSHOT \
        -B
        
    mv isis-angularjs-simpleapp/* .
    rmdir isis-angularjs-simpleapp

Clone `angular-seed` (as at `0edde11d781eb2834561db30c4b4a4778e27907c`):
    
    git clone https://github.com/angular/angular-seed.git
    rm -rf angular-seed/.git
    mv angular-seed webapp/src/main/webapp/angular
    
Install dependencies (as per angular-seed's README):

    cd webapp/src/main/webapp
    npm install
    
Errors reported in `npm-debug.log` (running on Windows?).  However, ran again:

    npm install

and completed successfully.

Note that `node_modules` and `bower_components` are already ignored through the `.gitignore` in the
`webapp/src/main/webapp/angular` directory)


### run the app

Import into IDE, run.

Can browse to http://localhost:8080/angular/app/index.html

w00t!


### disable RO security

in webapp/src/main/webapp/WEB-INF/web.xml

    <init-param>
        <param-name>authenticationSessionStrategy</param-name>
        <param-value>org.apache.isis.viewer.restfulobjects.server.authentication.AuthenticationSessionStrategyBasicAuth</param-value>
    </init-param>

to

    <init-param>
        <param-name>authenticationSessionStrategy</param-name>
        <param-value>org.apache.isis.viewer.restfulobjects.server.authentication.AuthenticationSessionStrategyTrusted</param-value>
    </init-param>

### Update index.html and add a simple controller

In `index.html`:

      <h1>Services:</h1>

      <ul class="list-group" ng-controller="IsisCtrl">
          <li class="list-group-item"
              ng-repeat="service in isisdata.value">
              <a href="{{service.href}}">{{service.title}}</a>
          </li>
      <ul>

In `js/controllers.js`:

      .controller('IsisCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.yeomanStuff = function () {
          return [
            'yo',
            'Grunt',
            'Bower'
          ];
        };


        function ISISwww($scope, $http) {

          $http({

            method: "GET",

            url: '/restful/services/'

          }).

          success(function (isisdata) {

              $scope.isisdata = isisdata;

            });

        };

        ISISwww($scope, $http);

      }])


### Cross origin support

To demonstrate cross-origin support, changed the URL to load from fully qualified host name:
      
      url: 'http://halyogatp:8080/restful/services/'
      
where "halyogatp" is my hostname.  Change as required.

Running the app caused the expected cross-origin error to occur:

![](https://raw.github.com/danhaywood/isis-angularjs-simpleapp/master/images/cors-error.png)

Added in filter:

    <filter>
        <filter-name>cross-origin</filter-name>
        <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
        <init-param>
            <param-name>allowedOrigins</param-name>
            <param-value>*</param-value>
        </init-param>
        <init-param>
            <param-name>allowedMethods</param-name>
            <param-value>GET,POST,PUT,DELETE</param-value>
        </init-param>
        <init-param>
            <param-name>allowedHeaders</param-name>
            <param-value>*</param-value>
        </init-param>
        <init-param>
            <param-name>preflightMaxAge</param-name>
            <param-value>1800</param-value>
        </init-param>
        <init-param>
            <param-name>allowCredentials</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>cross-origin</filter-name>
        <url-pattern>/restful/*</url-pattern>
    </filter-mapping>

and corresponding class [CrossOriginFilter](https://github.com/danhaywood/isis-angularjs-simpleapp/blob/master/webapp/src/main/java/org/eclipse/jetty/servlets/CrossOriginFilter.java) in `webapp/src/main/java`

And, w00t! once more.
