---
title: Writing a documentation
keywords: documentation, doc, tutorial, wiki, edit
last_updated: Jan 3, 2020
permalink: tristanv2-writingdoc.html
folder: tristanv2
summary: "Tutorial on how to contribute to this wiki."
---

This website is made with the help of the `jekyll` framework. To edit/update it -- you may want to first install a couple of things.

### Prerequisites for Mac

1. install [brew](https://brew.sh/);
2. install `rbenv`:
  ```bash
  brew install rbenv
  ```
3. add `eval "$(rbenv init -)"` at the end of your `~/.zshrc` (if you're using `bash` instead of `zsh` add the same line to your `~/.bash_profile`);
4. restart the terminal;
5. check the latest version of `ruby` available:
  ```bash
  rbenv install -l
  ```
6. install the latest `ruby` (in my case it was `2.7.2`):
  ```bash
  rbenv install 2.7.2
  ```
7. set it as default:
  ```bash
  rbenv global 2.7.2
  ```
8. (optional) disable documentations:
  ```bash
  echo "gem: --no-document" > ~/.gemrc
  ```
9. install `bundler`:
  ```bash
  gem install bundler
  ```

## Compiling the website

Now that all the prerequisites are satisfied we can download the source code for the wiki by doing: `git clone https://github.com/ntoles/tristan-wiki.git`. In the root directory of the website first type `bundle install` to locally install all the dependencies required to build the website, and then you may build it locally and display it on a local server by running
```bash
bundle exec jekyll serve
```
This will run a local server (in my case it was `localhost:4000`) with the built website which will update as soon as any of the files are edited.
