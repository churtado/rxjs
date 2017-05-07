import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

var requestStream = Rx.Observable.of('http://api.github.com/users');

requestStream.subscribe(requestUrl => {
    $.getJSON(requestUrl)
        .done(response => {
            console.log(response);
        });
    
});