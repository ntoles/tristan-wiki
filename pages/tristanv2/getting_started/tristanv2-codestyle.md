---
title: Coding style
keywords: style, rules
last_updated: Dec 17, 2019
permalink: tristanv2-codestyle.html
folder: tristanv2
---

Please read this carefully.

1. We use the following style for naming variables and functions:
    * variables are named lowercase with underscores (`_`) if necessary, e.g.:
        > `my_new_var`;

    * function names start lowercase without underscores and can be continued uppercase, e.g.:
        > `myNewFunc()`;

    * modules always start with `m_` and are always lowercase without underscores, e.g.:
      > `m_mynewmodule`.

2. Remember, for fortran `THIS` and `tHIs` and `this` are all the same.
3. Use indentations when entering loops, functions, conditional statements etc! Standard for this code is two spaces per one indent.
4. `#ifdef`-s and other precompiler macros can also be indented(!), as now `Makefile` precompiles the code with the new `cpp` compiler before compiling with fortran.
5. Please use spaces and brackets to make the code more readable:
    - in arithmetic statements, e.g.:
        > `2 + 3 * 5 / (2 + a)` instead of `2+3*5/(2+a)`;

    - in function arguments, e.g.:
        > `myFunction(2, var, "my string")` instead of `myFunction(2,var,"my string")`;

    - in assignments, e.g.:
        > `my_var = my_other_var` instead of `my_var=my_other_var`;

    - in conditional statements, e.g.:
        > `if ((one .eq. 1) .or. (two .eq. 2))` instead of `if(one.eq.1 .or. two.eq.2)`.

6. Try to use standard Fortran `.eq.`, `.lt.` and other logical comparison operators instead of `==`, `<`.
7. Use `interface`-s and `module procedure` to overload some of the auxiliary functions and make them accept generic arguments.
8. Do __not__ use `goto` statements.

All these advices and rules are simply to make the code look visually comprehensible and help those working with it enjoy the time. Thank you for following these advices.
