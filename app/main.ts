import * as Rx from 'rxjs-es/Rx';
import { Observable } from 'rxjs-es/Observable';
import * as $ from 'jquery';

interface GitHubUser {
    avatar_url:string;
    events_url:string;
    followers_url:string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
}

var requestStream: Observable<string> = Rx.Observable.of('http://api.github.com/users');

var responseStream: Observable<GitHubUser[]> = requestStream
    .flatMap(requestUrl =>
        Rx.Observable.fromPromise(Promise.resolve<GitHubUser[]>($.getJSON(requestUrl)))
    );

/*responseStream.subscribe( (response: GitHubUser[]) => {
    console.log(response[0]);
})*/

function createSuggestionStream(responseStream: Observable<GitHubUser[]>) {
    return responseStream.map((listUser: GitHubUser[]) => {
        return listUser[Math.floor(Math.random()*listUser.length)];    
    })
}

var suggestion1Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);
var suggestion2Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);
var suggestion3Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);

function renderSuggestion(userData: GitHubUser, selector:string): void {
    var element  = document.querySelector(selector);
    var usernameEl = element.querySelector('.username');
    usernameEl.setAttribute('href', userData.html_url);
    usernameEl.textContent = userData.login;
    var imgEl = element.querySelector('img');
    imgEl.src = userData.avatar_url;
}

suggestion1Stream.subscribe(user => {
    renderSuggestion(user, '.suggestion1');
});

suggestion2Stream.subscribe(user => {
    renderSuggestion(user, '.suggestion2');
});

suggestion3Stream.subscribe(user => {
    renderSuggestion(user, '.suggestion3');
});