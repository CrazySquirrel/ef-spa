# Even Faster Single Page Application: 1.Environment
Let's start creating our application.

First we need to install some software dependencies like https://nodejs.org/en/. Then we'll create a directory for our application and enter it.

## 1.1 Package.json
Now we'll create the package.json file in this directory.

We can do this manually or by calling:

```
npm init
```

Our package.json will look like this (some properties are omitted or added):

```
{
  "name": "ef-spa",
  "private": true,
  "version": "0.0.0",
  "description": "Even Faster Single Page Application – example web application",
  "keywords": [
    "single page application"
  ],
  "license": "MIT",
  "author": "Sergei Iastrebov <info@crazysquirrel.ru>"
}
```

In this package.json we declared following fields:

* name - package name of our app (in lowercase with dashes)
* private - flag if we want to create private app
* version - current app version (in simver format http://simver.org/)
* description - short description of our app
* keywords - key property of our app
* license - license type of our app (different license types https://spdx.org/licenses/)
* author - author credentials (name and email)

This is the file you usually start with.

Later, when we'll create git repository, we'll add other fields, like:

```
{
	"homepage": "https://github.com/CrazySquirrel/ef-spa",
	"bugs": {
		"url": "https://github.com/CrazySquirrel/issues",
		"email": "info@crazysquirrel.ru"
	},
	"man": "./README.md",
	"repository": {
		"type": "git",
		"url": "https://github.com/CrazySquirrel/ef-spa"
	}
}
```

This fields need for:

homepage - main page of your git repository
bugs - instruction where to send bugs and read known issues
man - manual for your app, with some description and instructions
repository - information about where is your repository located
Later we going to add some other fields:

```
{
  "scripts": {},
  "dependencies": {},
  "devDependencies": {}
}
```

* scripts - list of shortcut commands
* dependencies - list of npm packages that includes into your code
* devDependencies - list of packages that you use for development (tools, typings, ets.)

To know more about package.json look at documentation (https://docs.npmjs.com/files/package.json)

## 1.2 LICENSE.md, README.md, CHANGELOG.md

To provide some information about our project we going to add some other files:

* LICENSE.md - contains a text description of license
* README.md - contains description and manual for app
* CHANGELOG.md - contains versions, changes and dates when they was created (usually created automatically)

We going to talk more about it when we going to discuss documentation and deployment.

## 1.3 Style guide

If you are going to work on a project as a team, or you want to set development style, it's a good idea to add style guide files for IDEs.

* JetBrains style guid file - https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml (how to set it https://www.jetbrains.com/help/idea/configuring-code-style.html)
* EditorConfig - https://editorconfig.org/

## 1.4 Dependencies

Before moving on, let's talk about dependencies, since we going to use them a lot.

Typically, following packages are used in project:

* assembling tools;
* typings;
* external code packages;
* another packages.

Things to look at when choosing package:

* license - some licenses include paid use, open publication, and other terms;
* version - some versions may not be compatible with other code, documentation or examples;
* documentation, typings, open issues, downloads - to make sure that this package is easy to use and doesn't contain critical errors (including bugs and safety issues).

Dependencies can be installed and saved globally (if it's some sort of tool) or locally (preferably), in devDependencies (if this pacakge not used as part of production code) or in dependencies (if it's going to be a part of your production code).

When you install and save dependencies they will be saved in package.json in dependencies or devDependencies section, with name and version (for example "webpack": "4.16.1"). Some packages can be installed with mask (like "^4.x.x"), if you care only about major version, but it's preferably to specify full version without any masks for stability reasons. It's also a good idea to use package-lock.json to specify subpackages.

Dependencies can be installed from npm by version, from local file or from git repository.

More about dependency you can read here https://docs.npmjs.com/files/package.json#dependencies

More about installation to can read here https://docs.npmjs.com/cli/install

# What we have at the moment:

Project directory:

* CHANGELOG.md
* LICENSE.md
* package.json
* README.md
* STYLE_GUIDE.xml
* CHANGELOG.md - empty
* LICENSE.md - MIT license
* package.json

```
{
  "name": "ef-spa",
  "private": true,
  "version": "0.0.0",
  "description": "Even Faster Single Page Application – example web application",
  "keywords": [
    "single page application"
  ],
  "license": "MIT",
  "author": "Sergei Iastrebov <info@crazysquirrel.ru>",
  "homepage": "https://github.com/CrazySquirrel/ef-spa",
  "bugs": {
    "url": "https://github.com/CrazySquirrel/issues",
    "email": "info@crazysquirrel.ru"
  },
  "man": "./README.md",
  "repository": {
    "type": "git",
    "url": "https://github.com/CrazySquirrel/ef-spa"
  },
  "scripts": {},
  "dependencies": {},
  "devDependencies": {}
}
```

* README.md

```
# Even Faster Single Page Application
```

* STYLE_GUIDE.xml - https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml

**Next time we going to talk about Git**

https://www.linkedin.com/pulse/even-faster-single-page-application-2git-sergei-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**

