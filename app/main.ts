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

var refreshButton: Element = document.querySelector('.refresh');

var refreshClickStream: Observable<any> = Rx.Observable.fromEvent(refreshButton, 'click');

var startupRequestStream = Rx.Observable.of('https://api.github.com/users');

var requestOnRefreshStream = refreshClickStream
    .map((ev: MouseEvent) => {
        var randomOffset = Math.floor(Math.random()*500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });

var responseStream: Observable<GitHubUser[]> = requestOnRefreshStream.merge(startupRequestStream)
    .flatMap(requestUrl =>
        Rx.Observable.fromPromise(Promise.resolve<GitHubUser[]>($.getJSON(requestUrl)))
    );

/*responseStream.subscribe( (response: GitHubUser[]) => {
    console.log(response[0]);
})*/

function createSuggestionStream(responseStream: Observable<GitHubUser[]>) {
    return responseStream.map((listUser: GitHubUser[]) => {
        return listUser[Math.floor(Math.random()*listUser.length)];    
    }).startWith(null);
}

var suggestion1Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);
var suggestion2Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);
var suggestion3Stream:Observable<GitHubUser> = createSuggestionStream(responseStream);

function renderSuggestion(suggestedUser: GitHubUser, selector:string): void {
    var suggestionEl: Element  = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.setAttribute("style","visibility:hidden");
    }else{
        suggestionEl.setAttribute("style","visibility:visible");
        var usernameEl = suggestionEl.querySelector('.username');
        usernameEl.setAttribute('href', suggestedUser.html_url);
        usernameEl.textContent = suggestedUser.login;
        var imgEl = suggestionEl.querySelector('img');
        imgEl.src = "";
        imgEl.src = suggestedUser.avatar_url;
    }
    
}

suggestion1Stream.subscribe((user:GitHubUser) => {
    renderSuggestion(user, '.suggestion1');
});

suggestion2Stream.subscribe((user:GitHubUser) => {
    renderSuggestion(user, '.suggestion2');
});

suggestion3Stream.subscribe((user:GitHubUser) => {
    renderSuggestion(user, '.suggestion3');
});