## Pommidoro

### Requirements

- [BabelJS](http://babeljs.io/)
- [WebPack](http://webpack.github.io) (currently used only to serve static files via the [Dev Server](http://webpack.github.io/docs/webpack-dev-server.html))

### Development

In a terminal launch the watcher:

```bash
$ babel --watch --extensions '.es6' js/ --out-dir js/
```

In another terminal launch the web server:

```bash
$ webpack-dev-server
```

Now open `http://localhost:8080` with your web browser.

This webapp has been tested only in Chrome so far.
