var app =  angular.module("wikipediaReader", [
    "ngRoute",
    "ngSanitize"
]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "pages/start.html",
        controller: "StartController"
    })
    .when("/results/:endpoint", {
        templateUrl: "pages/results.html",
        controller: "ResultsController"
    })
    .otherwise({
        redirect: "/"
    });
});

app.service("wikipediaService", function($http) {
    return {
        endpoints: {
            "en": {
                title: "Englische Wikipedia Einträge",
                url: "https://en.wikipedia.org/w/api.php"
            },
            "de": {
                title: "Deutsche Wikipedia Einträge",
                url: "https://de.wikipedia.org/w/api.php"
            },
            "fr": {
                title: "Französische Wikipedia Einträge",
                url: "https://fr.wikipedia.org/w/api.php"
            }
        },
        query: function(endpoint, keyword) {
            var url= this.endpoints[endpoint].url;
            return $http.jsonp(url, {
                params: {
                    format: "json",
                    action: "query",
                    generator: "search",
                    gsrlimit: "5",
                    prop: "extracts",
                    exintro: 1,
                    exsentences: 10,
                    exlimit: "max",
                    gsrsearch: keyword,
                    callback: "JSON_CALLBACK"
                }
            }).then(function(data){
                return data.data.query.pages
            });
        }
    };
});

app.controller("StartController", function($scope, wikipediaService) {
    $scope.endpoints = wikipediaService.endpoints;
});

app.controller("ResultsController", function($scope, $routeParams, wikipediaService) {
    console.log($routeParams);
    $scope.results = {};
    $scope.runSearch = function(keyword) {
        var result = wikipediaService.query($routeParams.endpoint, keyword);
        result.then(function(data) {
            $scope.results = data;
            console.log(data);
        });
    };
});

app.directive("panel", function() {
    return {
        templateUrl: "elements/panel.html",
        scope: {
            title: "@"
        },
        transclude: true
    }
});