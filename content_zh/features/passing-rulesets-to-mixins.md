> Allow wrapping of a css block, defined in a mixin

Released [v1.7.0]({{ less.master }}CHANGELOG.md)

You may want to define a mixin that will abstract out either wrapping a piece of code in a media query or a non supported browser class name. You can now pass rulesets to mixins so that the mixin can wrap the content. E.g.

```less
.desktop-and-old-ie(@rules) {
  @media screen and (min-width: 1200) { @rules(); }
  html.lt-ie9 &                       { @rules(); }
}

header {
  color: blue;

  .desktop-and-old-ie({
    background: red;
  });
}
```

Here the `desktop-and-old-ie` mixin defines the media query and root class so that you can use a mixin to wrap a piece of code. This will output..

```css
header {
  background: blue;
}
@media screen and (min-width: 1200) {
  header {
    background: red;
  }
}
html.lt-ie9 header {
  background: red;
}
```

A ruleset can be now assigned to a variable or passed in to a mixin and can contain the full set of less features, e.g.

```less
@my-ruleset: {
    .my-selector {
      background-color: black;
    }
  };
```

You can even take advantage of media query bubbling, for instance

```less
@my-ruleset: {
    .my-selector {
      @media tv {
        background-color: black;
      }
    }
  };
@media (orientation:portrait) {
    @my-ruleset();
}
```

which will output

```css
@my-ruleset: {
    .my-selector {
      @media tv {
        background-color: black;
      }
    }
  };
@media (orientation:portrait) {
    @my-ruleset();
}
```