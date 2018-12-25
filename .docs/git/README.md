# Even Faster Single Page Application: 2.Git

https://www.linkedin.com/pulse/even-faster-single-page-application-1environment-sergei-iastrebov/

Previously we talking about basic environment set. Now let's talk about how to save code, control versions and set development process with git.

## 2.1 Start with GIT

First we need to install git https://git-scm.com/ . You can check full documentation about git https://git-scm.com/book/en/v2 or read few notes below.

Then, if we do everything right, we can go into project directory and execute:

```
git init
```

This command initializes an empty repository in project directory.

Now we can save our code locally, version it, switch between different versions and etc. But for further actions it's better to connect with remote git repository.

## 2.2 Git remote repository

For remote git repository, you can use many options: you can configure your one server, use paid or free existing server, or even use another version control system (svn for example). But for ease of demonstration, we will use public git repository on https://github.com/.

To do so, you go to https://github.com/ and register your profile. After registration it'll look something like that:

![](./1.png)

Then you go to repositories tab, press "new" button and fill in "new repository" form:

![](./2.png)

After press "Create repository" button you will be redirect to repository page with some instructions for further actions. 

Let's execute only one command and leave this repository for later:

```
git remote add origin git@github.com:CrazySquirrel/ef-spa.git
```

It's also a good idea to add ssh key, so as not to enter name and password at every push.

How to do it read here https://help.github.com/articles/connecting-to-github-with-ssh/ or follow the simple instruction:

* go to your git profile settings;
* go to "SSH and GPG keys" tab;
* click to "New SSH key" button;
* use command "ls -al ~/.ssh" to check if you've any ssh keys, like id_rsa.pub;
* if not use https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#generating-a-new-ssh-key instruction to generate it;
* than copy it with command "pbcopy < ~/.ssh/id_rsa.pub";
* and paste into the form.

## 2.3 Configure git locally

Before commit something we'll add .gitignore file in our project to exclude extra files from git. .gitignore it's a file which contains patterns for file exclusion. You can read more about .gitignore syntax here https://git-scm.com/docs/gitignore For start our .gitignore will look like this:

```
.idea
.DS_Store

/node_modules
```

* .idea - exclude JetBrains IDE file
* .DS_Store - exclude Mac OS file system file
* node_modules - exclude node_modules folder

If everything is done correctly, "git status" command in project directory should return:

```
.gitignore
CHANGELOG.md
LICENSE.md
README.md
STYLE_GUIDE.xml
package.json
```

Let's do some extra steps before we commit these files.

## 2.4 Git hooks

To make the workflow more convenient and streamlined, let's add git hooks. Git hooks are scripts that git executes before or after events such as: commit, push, receive and etc. You can read more about git hooks here https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks

We can add git hooks manually into .git/hooks as bash scripts or use more comfortable npm package like husky. Husky will let us to run npm scripts on different git hooks very easily. Let's install it.

```
npm install husky --save-dev
```

This command will add husky into package.json, create node_modules folder and package-lock.json. Once it's installed, we can add parameters for husky to package.json

```
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "post-commit": [
      "git status"
    ],
    "post-checkout": [
      "npm ci"
    ],
    "post-merge": [
      "npm ci"
    ]
  }
}
```

On checkout and merge we going to reinstall dependencies. On post commit we going to show git status. And for commit message we going to use commitlint. What is commitlint and why we going to use it we going to talk further.

## 2.5 Conventional git commit

When working with git developers usually use git flow. In addition to certain rules for working with branches, it also provides some requirement for branches and commits names.

Branch names usually contains developer login, description and task number to help when switching between branches and tasks, and understanding what branch about.

Commit names can be very variable. It can contain task number, description, changes type and etc. But for better versioning and understanding of changes in addition to readable description, it's better to use conventional commit message.

Basically conventional commit, it's a special commit message format, like this:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

It's contains type, scope, description, body and footer. You can read more about conventional commit here https://www.conventionalcommits.org/en/v1.0.0-beta.2/ Later we going to use conventional commits for automatically change of version.

In the meantime, to make our lives easier, we going to use commitlint. We going to install it:

```
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

And add husky "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",

## 2.6 Git flow

The last thing we need to talk about before make our first commit is git flow. 

Git flow is a set of rules for working with branches and tasks. In general, it's implied a stable master branch, a release branch, and separate branches for tasks.

To read more about git flow got to https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

## 2.7 Git LFS

_Git Large File Storage (LFS) replaces large files such as audio samples, videos, datasets, and graphics with text pointers inside Git, while storing the file contents on a remote server like GitHub.com or GitHub Enterprise._

Basically, git lfs it's an additional version control repository thing, which helps to store binary files separately from rest of the code. And it's useful because it makes it easier to version binary files. Why should binary files be versioned differently? The answer is simple, they rarely change and usually change completely, and their partial change (diff) does not make much sense. So to make life easier, it's worth using git lfs.

We can easily add git-lfs by installing and configuring it according to the instructions from the site https://git-lfs.github.com/

* install git lfs with "brew install git-lfs" (for mac os users);
* initialize git lfs in project folder with "git lfs install";
* add binary files like jpg, png and gif with "git lfs track "*.png""
* and don't forget to add .gitattributes in initial commit

## 2.8 First commit

Now let's make our first commit and push it to our git repository.

Before commit, we should review changes with the command:

```
git status
```

To do so, you should see something like this:

```
.gitattributes
.gitignore
CHANGELOG.md
LICENSE.md
README.md
STYLE_GUIDE.xml
package-lock.json
package.json
```

Than we can add this files with git add command, like:

```
git add .
```

Now we can commit this changes with:

```
git commit -m "build(init): basic env and git init"
```

And after that we can push this commit to the repository:

```
git push origin master
```

If everything went well, you should see your first commit in repository:

![](./3.png)

# What we have at the moment:

We installed several packages, added parameters for git and husky, and also commited our first commit.

https://github.com/CrazySquirrel/ef-spa/commit/87c93bcf01b9e8fa23d3df38602e41253fb41fe3

**Next time we going to talk about webpack and project build.**

https://www.linkedin.com/pulse/even-faster-single-page-application-3webpack-sergei-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**
