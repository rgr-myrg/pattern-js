# Pattern JS
Pattern JS is a light weight pocket-sized minimalist framework of common design patterns written in JavaScript.

# Features
- Publisher-Subscriber: Pub/Sub and custom events.
- Observer-Observable: Classic Observer pattern.
- Event-Signal: Stack of listeners for easy transport of events and data.
- Notifier-Receiver: behavioral design pattern with event notifications.

You can also:
- Use the built-in FIFO Queue.
- View and run [Usage Samples](https://github.com/rgr-myrg/pattern-js/tree/develop/samples) in your browser.

# Installation
Pattern JS requires Node.js, NPM, and Gulp.
Clone the repo:
```sh
git clone https://github.com/rgr-myrg/pattern-js.git
cd pattern-js
```
Install dependencies and run *gulp* to build.
```sh
$ npm install -d
$ gulp
```

# Running Tests
Executing *gulp* from the command line runs test by default. You can also run the task directly:
```sh
$ gulp start-tests
```
# Development
Want to contribute? Great!

Per [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html), create your own *feature* branch.
```sh
$ git checkout develop
$ git pull origin develop
$ git branch feature/your-branch-name
$ git checkout feature/your-branch-name
```
Run tests continuously and make your changes.
```sh
$ gulp watch
```
Submit a *pull request* when finished!
# Usage Samples
#### Publisher-Subscriber
```javascript
// Create a Subscriber
var subscriber = {
    onMsgReceived: function(msg) {
        console.log("received: ", msg);
    }
};

// Create an instance of Publisher and register the Subscriber
var publisher = Pattern.Publisher().registerSubscriber(subscriber);

// Dispatch the notification
publisher.notify("onMsgReceived", {name: "test", text: "my message"});
```
#### Event-Signal
```javascript
// Create a signal and add listeners.
var signal = Pattern.EventSignal()
            .addListener(
                function(msg) {
                    console.log("received: ", msg);
                }
            );

// Dispatch the notification
signal.dispatch({name: "test", text: "my message"});
```

#### Notifier-Receiver
```javascript
// Create a Receiver with a handler method.
var receiver = Pattern.Receiver()
            .on("msgReceived", function(msg) {
                console.log("received: ", msg);
            });
            
// Create the Notifier and register the Receiver.
var notifier = Pattern.Notifier().addReceiver(receiver);

// Send the notification
notifier.notify("msgReceived", {name: "test", text: "my message"});
```

#### Observable-Observer
```javascript
// Create the Observer
var observer = Pattern.Observer({
        onMsgReceived: function(msg) {
            console.log("received: ", msg);
        }
    });
    
// Create the Observable and register the Observer.
var observable = Pattern.Observable().addObserver(observer);

// Send the notification
observable.notifyObservers("onMsgReceived", {name: "test", text: "my message"});
```

# Working Samples
Run the samples in your browser
[Usage Samples](https://github.com/rgr-myrg/pattern-js/tree/develop/samples)

# To-do
- Code for additional design patterns
- Write more Tests

# License
[MIT License](https://opensource.org/licenses/MIT)
