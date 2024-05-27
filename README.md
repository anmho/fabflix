# Fabflix Monorepo

[Demo Project 1](https://www.youtube.com/watch?v=IbJSeyeTfig&ab_channel=MehmetNadi)
[Demo Project 2](https://www.loom.com/share/8825fc9f871f4e20834d4b7e92305752)
[Demo Project 3](https://www.youtube.com/watch?v=gwFAarzxbwI&ab_channel=MehmetNadi)

## Project 4 Writeup
- # General
    - #### Team#:
    
    - #### Names:
    
    - #### Project 5 Video Demo Link:

    - #### Instruction of deployment:

    - #### Collaborations and Work Distribution:


- # Connection Pooling
    - #### Include the filename/path of all code/configuration files in GitHub of using JDBC Connection Pooling.
    
    - #### Explain how Connection Pooling is utilized in the Fabflix code.
    
    - #### Explain how Connection Pooling works with two backend SQL.
    

- # Master/Slave
    - #### Include the filename/path of all code/configuration files in GitHub of routing queries to Master/Slave SQL.

    - #### How read/write requests were routed to Master/Slave SQL?


## Contributions


### Project 4
| Task | Entry | Assignee |
|----------|-----------|--------------|
|Full-text search on the movie title|Use Full-text search on the movie title field, Jump to the corresponding Movie List Page and show correct results.|Mehmet Nadi, Andrew Ho|
|Autocomplete UI|Up and Down keys navigation in dropdown list. Item is highlighted.|Andrew Ho|
|Autocomplete UI|Input box text is updated along with Up and Down keys navigation.|Andrew Ho|
|Autocomplete UI	|Show suggestion list in 1 category: Movie (autocomplete search is on movie title).	|Mehmet Nadi|
|Autocomplete UI	|No more than 10 items in total in the suggestion list.|Mehmet Nadi, Andrew Ho|
|Autocomplete UI	|Autocomplete delay (300ms).	|Mehmet Nadi|
|Autocomplete UI	|Enable Autocomplete only for >= 3 chars.		|Mehmet Nadi|
|Search	|Full-text search should be implemented using AJAX (RESTful API).		|Mehmet Nadi|
|Search	|Cache the suggestion lists in Front-end for past queries and reuse it when possible.		|Mehmet Nadi|
|Jump Action	|Press "Enter" Key directly or click search button without choosing any item should do a normal Search (Full-text search).|Andrew Ho|
|Jump Action	|Click on a suggession entry will jump to corresponding Single Movie Page.|Andrew Ho|
|Jump Action	|Use the  Up/Down arrow key and press the "Enter" Key on a suggestion entry to jump to the corresponding Single Movie Page.|Andrew Ho|
|Javascript Console Log	|Output a javascript console log when an Autocomplete query is initiated.|Mehmet Nadi, Andrew Ho|
|Javascript Console Log	|Output a javascript console log to differenciate if the suggestion list is coming from Front-end cache or Backend server.|Andrew Ho|
|Javascript Console Log	|Output a javascript console log of the used suggestion list (in a javascript array).	|Andrew Ho|
|Reasonable speed	|Autocomplete should finish within a reasonable amount of time (delay + query time <= 2 secs).|Andrew Ho|
|Connection Pooling	|Enable Connection Pooling for all servlets (both single and scaled versions).|Andrew Ho|
|Connection Pooling|Answer questions from README.md template regarding Connection Pooling.|Andrew Ho|
|Master/slave|Enable MySQL replication on the scaled version.|Answer questions from README.md template regarding Connection Pooling.|Andrew Ho|
|Master/slave|Routing read/write queries correctly to Master/Slave MySQL.|Andrew Ho|
|Master/slave|Answer questions from README.md template regarding Master/Slave.|Answer questions from README.md template regarding Connection Pooling.|Andrew Ho|
|Load balancing|Master/slave AWS instances are set up and accessible with HTTP on port 8080, (optional) HTTPS on port 8443.|Answer questions from README.md template regarding Connection Pooling.|Andrew Ho|
|Load balancing|AWS and GCP load balancers redirect traffic on port 80 to Master/Slave AWS instances.|Andrew Ho|
|Load balancing|reCAPTCHA still works properly on website.|Answer questions from README.md template regarding Connection Pooling.|Andrew Ho|


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
Invalid Movies: 95
Invalid Stars: 2769
Invalid Cast Members: 16870

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

Optimization Techniques:

1) Run StarParser and MovieParser on two threads so that parsing and inserting can happen in parallel. Finally join these results to insert new stars_in_movies
2) Use hashmaps and hash sets to check for duplicates items and quick lookups for key value pairs (vs querying database for occurrence)
3) Use batch inserts to prevent round trips to the database

These optimizations significantly reduce parsing and insertion time from the naive approach which is to parse sequentially and insert each item separately. About 3x performance gain. Total parsing time is about 8 seconds. 



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


