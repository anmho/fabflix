# Fabflix Monorepo

[Demo Project 1](https://www.youtube.com/watch?v=IbJSeyeTfig&ab_channel=MehmetNadi)
[Demo Project 2](https://www.loom.com/share/8825fc9f871f4e20834d4b7e92305752)
[Demo Project 3](https://www.youtube.com/watch?v=gwFAarzxbwI&ab_channel=MehmetNadi)
## Contributions
### Project 3
| Task | Entry | Assignee |
|----------|-----------|--------------|
|reCAPTCHA|reCAPTCHA works properly, with appropriate error messages.		|Mehmet Nadi, Andrew Ho|
|HTTPS|HTTPS works properly.		|Andrew Ho|
|HTTPS|Redirect all HTTP traffic to HTTPS (force use HTTPS).		|Andrew Ho|
|Password Encryption	|Encrypt password in DB, and login should verify user input with encrypted password	|Mehmet Nadi|
|Prepared Statement	|Use prepared statements for all queries in the codebase and included in README		|Mehmet Nadi, Andrew Ho|
|Employee Dashboard	|Login to dashboard page using employee credentials	|Mehmet Nadi|
|Employee Dashboard	|reCAPTCHA works properly, with appropriate error messages.		|Mehmet Nadi|
|Employee Dashboard	|Show database metadata		|Mehmet Nadi|
|Employee Dashboard	|Add a new star successfully. Stars linked to movie should be searchable/accessible on the webpage		|Mehmet Nadi|
|Employee Dashboard	|Add a new movie successfully with a new star, a new genre. Should be searchable/accessible on the webpage			|Andrew Ho|
|Employee Dashboard	|Add a new movie successfully with existing star, existing genre. Should be searchable/accessible on the webpage			|Andrew Ho|
|Employee Dashboard	|Show error message when adding an existing movie (same title, year and director)			|Andrew Ho|
|Employee Dashboard	|Show all proper success messages and error messages		|Mehmet Nadi, Andrew Ho|
|XML Parsing	|Parsing main.xml successfully, movie title and director information shown correctly. Should be searchable/accessible on the webpage			|Andrew Ho|
|XML Parsing	|Parsing actors.xml successfully, birthYear of actors can be shown correctly. Stars linked to movie should be searchable/accessible on the webpage		|Andrew Ho|
|XML Parsing	|Parsing casts.xml successfully. Actors of movies should be searchable/accessible on the webpage		|Andrew Ho|
|XML Parsing	|Report inconsistency data to the user and included in README.		|Andrew Ho|
|XML Parsing	|Two parsing time optimization strategies, compared with the naive approach, included in README		|Andrew Ho|
|Extra Credit	|Register a domain name for Fabflix	|Andrew Ho|

### Inconsistencies Report 
Invalid Movies: 1184
Invalid Stars: 2769
Invalid Cast Members: 23269

For a more detailed view open inconsistencies.txt

Some inconsistencies found include:
Director name is under dirn  or dirname (not listed in the dtd specifications
Names containing tilde ~ 
Prefixes and postfixes
Null years
Null star names
‘S a’ (unknown actor) -> toss in the bin
Since our schema
Fuzzy matching for genre names using substring matching. Examples:
Multiple genres per <cat> tag
Romt.comd -> romance and comedy
Cnr -> comedy and romance
Things like dicu ducu dici -> docu (Very strange!)
Porb -> Adult
Gibberish genres -> set to unknown genres for the movie
Strange tilde formatting with prefixes and suffixes (Mr., Jr., III, II)

Optimization Techniques

Run StarParser and MovieParser on two threads so that parsing and inserting can happen in parallel. Finally join these results to insert new stars_in_movies
Use hashmaps and hash sets to check for duplicates items and quick lookups for key value pairs (vs querying database for occurrence)
Use batch inserts to prevent round trips to the database 



## Contributions
### Project 2
| Task | Entry | Assignee |
|----------|-----------|--------------|
|Login Page|Redirect any other pages to the Login Page if the user is not logged in	|Mehmet Nadi, Andrew Ho|
|Login Page|Show an error message for an incorrect username or password	| Mehmet Nadi|
|Login Page|Use HTTP POST	|Mehmet Nadi|
|Login Page|Login with a correct username and password	|Mehmet Nadi|
|Main Page	|Access to searching and browsing pages/functionalities		|Andrew Ho|
|Searching|Search by title		|Andrew Ho|
|Searching|Search by year		|Andrew Ho|
|Searching|Search by director			|Andrew Ho|
|Searching|Search by star's name		|Andrew Ho|
|Searching|Substring Matching is implemented correctly for searching title/director/star.			|Andrew Ho|
|Movie List Page |Display all required information; the first three genres are sorted correctly and hyperlinked; the first three stars are sorted correctly and hyperlinked.|Andrew Ho|
|Movie List Page |Implemented Pagination. Frontend cache and backend cache both can not exceed 100 records			|Andrew Ho|
|Movie List Page |Use "Prev/Next" buttons.				|Andrew Ho|
|Movie List Page |Change the number of listings "N" per page			|Andrew Ho|
|Movie List Page |Can sort the results on either first "title" then "rating", or first "rating" then "title", both in either ascending or descending order.			|Andrew Ho|
|Single Pages|A Single Movie Page has all genres, stars sorted correctly and hyperlinked.		|Mehmet Nadi, Andrew Ho|
|Single Pages|A Single Star Page has all movies sorted correctly and hyperlinked.			|Mehmet Nadi, Andrew Ho|
|Jump Functionality|Jump back to the Movie List Page from Single Pages without using the browser history (back button) or changing the url manually in browser address bar| Mehmet Nadi|
|Jump Functionality|Search/browse, sorting, pagination conditions are maintained when the user jumps back to the Movie List Page| Mehmet Nadi|
|Browsing|Browse by movie title's first alphanumeric letter: click on each letter jumps to the movie list page that only consists of movies starting with this letter |Andrew Ho|
|Browsing|Browse by genre: click on each genre jumps to the Movie List Page that only consists of the movies of this genre	|Andrew Ho|
|Shopping Cart Page|Display information about the current shopping cart (including movie title, price, quantity, and total price)	| Mehmet Nadi|
|Shopping Cart Page|Modify the quantity of each item	| Mehmet Nadi|
|Shopping Cart Page|Delete an item	| Mehmet Nadi|
|Payment Page|Ask for basic customer transactional information		| Mehmet Nadi|
|Payment Page|Show an error message for an incorrect input		| Mehmet Nadi|
|Place Order Action|Insert a sale record into ''moviedb.sales" table		| Mehmet Nadi|
|Place Order Action|Show a confirmation page that contains order details including sale ID, movies purchased and the quantities, and total price		| Mehmet Nadi|
|Additional Performance Functionality|Have a Checkout button for every page after login; if the user clicks it, it will jump to the shopping cart page	| Mehmet Nadi|
|Additional Performance Functionality|Have an "Add to Cart button" for each movie in the Movie List Page and each Single Movie Page; Indicate success/failure for a user click.| Mehmet Nadi|
|Extra Credit	|Show efforts to beautify the page and table using CSS and JavaScript	| Mehmet Nadi, Andrew Ho|

### Substring matching design
For filter parameters that require substring matching (`director`, `title`, `star`),
We add a where clause to the sql query if the query param e.g. `title` query param is not null.
Like this
`...WHERE title LIKE '%?'%'...`
The `title` query param is then parameterized into the query to prevent sql injection using a `PreparedStatement`. Then the query is executed.


