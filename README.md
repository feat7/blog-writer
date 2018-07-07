# Blog Writer

A blockchain based application to demonstrate content management with Node.js, Flask Server, GunDB and React. A feature reach content writer with keyword analyser, sentiment analysis with real time collaboration. This is for POC so no authentication system has been made to differentiate users.
See demo: [http://blog-writer.herokuapp.com](http://blog-writer.herokuapp.com)

## Getting Started
`
git clone https://github.com/feat7/blog-writer.git
cd blog-writer
yarn   OR   npm install
yarn start
`

### Prerequisites

The server directory contains a very simple flask application to provide APIs for keyword analyser and sentiment analysis. So both React application as well as the flask applilcation must be start seperately in order to run the application. Knowledge os Flask and React is required to succesfully debug any bug.

## Installing

### React Client

```
git clone https://github.com/feat7/blog-writer.git
cd blog-writer
yarn   OR   npm install
```

### Flask server

```
cd server
export FLASK_APP=server.py
flask run
```

Both application must run on seperate terminal. This application are developed and tested in Ubuntu 18.04, Ubuntu 16.04. So we need to verify the same for other platforms.

## Running the tests
`yarn run test`

## Motivation

We wanted to build a beautiful editor that would help blog writers and provide them data security,
decentrailized database, SEO suggestions and good insights with better user experience.
There are many collaborative editors out there but we haven't seen on working with blockchain,
machine learning and provide SEO services at the same time.
And we came up with this.

## Built With

* [React](http://reactjs.org/) - React Framework for front end.
* [Flask](http://flask.pocoo.org/) - Python framework for developing web applications.
* [GunDB](https://gun.eco/) - A simple P2P, Graph Database.

## Contributing

Submit pull requests for contributions. Feel free to create issues.

## Authors

* **Vinay Khobragade** - [feat7](https://github.com/feat7)
* **Kuldeep Pisda** - [kdpisda](https://github.com/kdpisda)
* **Mayank Chourasia** - [mayank2498](https://github.com/mayank2498)
* **Subhash Kshatri** - [Subhash1998](https://github.com/Subhash1998)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [ParallelDots](https://github.com/ParallelDots/ParallelDots-Python-API)
