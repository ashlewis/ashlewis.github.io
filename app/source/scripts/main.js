require.config({
    paths: {
        jquery: '../components/jquery/jquery'
    }
});

require(['modules/module'], function (Module) {

    'use strict';
    // use app here

    Module.init();

    console.log('main');

});