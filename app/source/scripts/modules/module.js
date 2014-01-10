define(['jquery'], function($) {

    var

    init = function(){
        $('body').append('<p>Injected by Module 2</p>');
        console.log('Injected by Module 2');
    };

    return {'init' : init};

});