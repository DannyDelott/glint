// Glint
// -----
//
// This is our app's main Angular module.

// Our dependencies are by shared services, feature controllers, and third-party modules.
var app = angular.module( 'glint', [
  'glint.services',
  'glint.ideas',
  'glint.ideaDetail',
  'glint.votes',
  'glint.auth',
  'glint.comments',
  'glint.users',
  'ngAnimate',
  'ngRoute',
  'glint.navbar',
  'ui.router',

] )

// Routing configuration, determines which view and controller to use

.config( function( $stateProvider, $urlRouterProvider ) {
    $stateProvider
      .state( 'ideas', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'app/navbar/navview.html',
            controller: "navbarCtrl as nav",
            cache: false,
          },
          'content': {
            templateUrl: 'app/ideas/ideas.html',
            controller: "IdeasCtrl as ictrl"

          },

        }
      } )
      .state( 'login', {
        url: '/login',
        views: {
          'header': {
            templateUrl: 'app/navbar/navview.html',
            controller: "navbarCtrl as nav",
            cache: false,
          },
          'content': {
            templateUrl: 'app/auth/login.html',
            controller: "AuthCtrl as actrl"

          },

      }
    })
    .state('signup',{
      url: '/signup',
      views: {
        'header': {
          templateUrl: 'app/navbar/navview.html',
          controller: "navbarCtrl as nav",
          // cache: false,
        },
        'content': {
           templateUrl: 'app/auth/signup.html',
           controller: "AuthCtrl as actrl"
          },

        }
      } )
      .state( 'collaborators', {
        url: '/ideas/:_id/collaborators',
        views: {
          'header': {
            templateUrl: 'app/navbar/navview.html',
            controller: "navbarCtrl as nav"
          },
          'content': {
            templateUrl: 'app/ideaDetail/ideaDetail.html',
            controller: "IdeaCollaboratorsCtrl as clctrl"
          },

        }
      })
      .state( 'profile', { //TODO:
        url: '/profile',
        views: {
          'header': {
            templateUrl: 'app/navbar/navview.html',
            controller: "navbarCtrl as nav"
          },
          'content': {
            templateUrl: 'app/userProfile/profile.html',
            controller: "ProfileCtrl as pctrl"
          },

        }
      })
      .state( 'users', {
       url: '/:_id',
        views: {
          'header': {
            templateUrl: 'app/navbar/navview.html',
            controller: "navbarCtrl as nav"
          },
          'content': {
            // templateUrl: 'app/ideaDetail/ideaDetail.html',
            // controller: "IdeaCollaboratorsCtrl as clctrl"
          },

        }
      });

    $urlRouterProvider.otherwise( '/' );

    // .when('/', {
    //       templateUrl: 'app/ideas/ideas.html',
    //       controller: "IdeasCtrl as ictrl"
    //     })
    //   .when('/login', {
    //       templateUrl: 'app/auth/login.html',
    //       controller: "AuthCtrl as actrl"
    //     })
    //   .when('/signup', {
    //       templateUrl: 'app/auth/signup.html',
    //       controller: "AuthCtrl as actrl"
    //     })
    //   .when('/ideas/:_id/collaborators', {
    //       templateUrl: 'app/ideaDetail/ideaDetail.html',
    //       controller: "IdeaCollaboratorsCtrl as iclctrl"
    //     })
    //   .when('/ideas/:_id/comments', {
    //       templateUrl: 'app/ideas/ideaDetail.html',
    //       controller: "AuthCtrl as actrl"
    //     })
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    // $urlRouteProvider.interceptors.push('AttachTokens');
  } )
  .factory( 'AttachTokens', function( $window ) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function( object ) {
        var jwt = $window.localStorage.getItem( 'com.shortly' );
        if ( jwt ) {
          object.headers[ 'x-access-token' ] = jwt;
        }
        object.headers[ 'Allow-Control-Allow-Origin' ] = '*';
        return object;
      }
    };
    return attach;
  } )
  .run( function( $rootScope, $location, Auth ) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on( '$routeChangeStart', function( evt, next, current ) {
      if ( next.$$route && next.$$route.authenticate && !Auth.isAuth() ) {
        $location.path( '/signin' );
      }
    } );
  } )
  // Custom filter for applying moment.js to our timestamps.
  .filter( 'moment', function() {
    return function( dateString ) {
      return moment( dateString ).fromNow();
    };
  } );
