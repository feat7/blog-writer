# SEO Writer

A blockchain based application to demonstrate content management with Gun DB and React. A feature reach content writer with keyword analyser, sentiment analysis with real time collaboration. This is for POC so no authentication system has been made to differentiate users.

## Getting Started

This REPO contains the React client. Various tests have not been performed as it is still in the development stage.

### Prerequisites

The server directory contains a very simple flask application to provide APIs for keyword analyser and sentiment analysis. So both React application as well as the flask applilcation must be start seperately in order to run the application. Knowledge os Flask and React is required to succesfully debug any bug.

### Installing

Run this commands in terminal to run application

```
yarn install
yarn start
```

In a seperate terminal
```
cd server
export FLASK_APP=server.py
flask run
```

Both application must run on seperate terminal. This application are developed and tested in Ubuntu 18.04, Ubuntu 16.04. So we need to verify the same for other platforms.

## Running the tests

Yet to perform

## Built With

* [React](http://reactjs.org/) - React Framework for front end
* [Flask](http://flask.pocoo.org/) - Python framework for developing web applications

## Contributing

Please submit pull requests for contributions. And contributions are always welcomed.

## Authors

* **Vinay Khobragade** - [feat7](https://github.com/feat7)
* **Kuldeep Pisda** - [kdpisda](https://github.com/kdpisda)
* **Mayank Chourasia** - [feat7](https://github.com/mayank2498)
* **Subhash Kshatri** - [feat7](https://github.com/Subhash1998)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [ParallelDots](https://github.com/ParallelDots/ParallelDots-Python-API)