6.170 Assignments
=================

The code in this repository was originally written for 6.170,
(also referred to as 6.S197 or 6.S183 in Fall 2011) Software
Studio. The class was taught by Prof. Daniel Jackson, and
covered software engineering best practices. There were several
substantial coding assignments, as well as a group final project
(not in this repository). All of the assignments were done
individually. I had significant design freedom - the prompt
simply listed a set of features which I had to provide, and
allowed me to decide the architecture myself.

This repository is primarily for me to present some code I've
written for interested parties. As of the  writing of this
readme file, the due date for all the assignments have passed.

If you're taking 6.170 in a subsequent semester though, please
don't use this code - it would make both me and the staff very sad.
You could look at it after you've submitted your own
version, to see how we did things differently :)

Assignment 1 - Object Models
----------------------------
This assignment did not require writiting code. I was asked
to draw object models for several scenarios. The goal was to

*   Practice planning out software architecture before implementing
    it.
*   Familiarize myself with the OM notation that the class used.
    *   It drew inspiration from Alloy, UML, among others, but was
        simplified compared to them.
*   Practice expressing ideas in writeups.

Time Frame: 1 week

Assignment 2 - Photo Gallery Generator
--------------------------------------
This is a desktop-based Python program that reads a directory
containing JPEG images (and possibly subdirectories with their
own images). The images can be annotated with IPTC metadata.
The program then generates a W3C-compliant static website that displays
the  JPEGs, along with captions inferred from the metadata.
The HTML does not contain frames, and is viewable from any
modern browser.
The topics covered in this assignment were:

*   A refresher of my skills with Python programming.
*   HTML and CSS that pass the W3C standards and have
    cross-browser compatibility.
*   Some basic JavaScript (which I added after fulfilling the
    given requirements).

Time Frame: 2 weeks

Assignment 3 - Othello Game
---------------------------
This is a browser-based implementation of the board game Othello,
written entirely using HTML, CSS, and JavaScript. It supports
games between 2 humans, or between a human and an AI player.
Three AI difficulties are provided. All code is standards-compliant
and the game should run in any modern browser. My JavaScript
is written with type annotations, and I used the Google Closure
Compiler to statically check the code for bugs.
This assignment emphasized the following ideas:

*   Structured JavaScript programming using
    *   Closures to enforce representation invariants.
    *   Unobtrusive JavaScript - only one variable is set
        in the global namespace, and the scripts are separate
        from the HTML.
    *   Object-orientation, using closures or prototypes.
    *   JQuery to interact with the DOM.
    *   underscore.js for various functional programming utilities.
    *   Event-driven programming to respond to user input.
*   More HTML and CSS, with cross-browser capability.
*   Game programming, primarily
    *    The concept of running a main loop, and responding to user
         input every time.

Time Frame: 3 weeks

Assignment 4 - Network Stickies
-------------------------------
Assignment 4 was a web-based sticky note manager application,
using JavaScript for the frontend, and Python with the Flask
framework for the backend. Users can add notes, remove them,
edit them, and move them around the screen with their mouse.
The application can support multiple users; each user has his/her
own set of notes.  All note data is persisted on the server side,
using Python's shelve module, so users can edit their notes
from any computer.  These concepts were covered:

*   More JavaScript programming
    *   Including most of the same ideas as those covered in
        Othello.
    *   Along with the JQuery UI library to handle dragging,
        dropping, and resizing notes.
*   AJAX requests to communicate between the client and the server.
*   An introduction to the Flask framework, and server-side
    programming.

Time Frame: 1 week

Assignment 5 - Link Shortener
-----------------------------
Assignment 5 was a URL shortener, which took arbitrary URLs
inputted by users, and converted them to shortened URLs.
Users could also specify their own URLs, if they wanted to alias
a link or similar. All communication between the client and the
server used AJAX, and data was persisted using SQLite. In the
process, I gained experience with the following ideas:

*   More experience with JavaScript and AJAX
*   More experience with server-side programming and Flask.
*   The 960 Grid CSS framework 
*   Testing controllers extensively using the stubs Flask provides
    to simulate requests and responses.
*   Designing and implementing a database schema
    *   In normal form, without duplication of data.
*   Writing SQL queries, including joins.

Time Frame: 1 week

Assignment 6 - Adventure Game
-----------------------------
The final individual assignment was a text-based adventure
game that should run in a browser. I was required to store the
game configuration in a SQLite database, meaning that I needed
to design the game in a way that could be mapped to a relational
schema. In addition, the logic involved with running the game had
to be decoupled from the game story. I accomplished this by storing
the game state in the database, and providing an internal DSL to
declare games, (examples are in gameconfigurations.py)
This assignment emphasized the ideas of:

*   Designing and implementing a complex database schema.
*   Running queries on said schema, including joins.
*   More practice with JavaScript and Python on the client and
    server sides.
*   Decoupling the game scenario from the engine.

Time Frame: 2 weeks
