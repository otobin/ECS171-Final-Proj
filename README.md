# ECS171-Final-Proj
ECS171 Final Project

## How to run?
```sh
pip3 install flask #to install flask 
py app.py #to run the app
```
## Problem statement
There have been occasional problems with walking around big cities like San
Francisco regarding robbery or other crimes in certain neighborhoods or streets,
especially at night. For instance, if we want to get a slice of pizza at Tenderloin
our Google Maps might route us through a street with bad crime history or
homelessness population which is risky, especially if you walk alone at night.
The app is designed to improve safety of the users by quantifying how safe a
neighborhood is based and would suggest whether to taken an Uber/Lyft rather
than walking, or to completely avoid it.

## Goal

The goal of our project is to design a model that can quantify the safety of a
route given by the Google Directions API. While giving the safest route is too
complex for an 8 week project, our group hopes to train a model that takes in
the geographic location of a route from Google, and outputs the safety on a
certain numerical scale using an unsupervised learning model like clustering.

## Dataset

The dataset we are going to use is Police Department Incident Reports during
2003 to May 2018 provided by the City and County of San Francisco with the
last update on March 25, 2021. The dataset contains 2.13M observations with 14
attributes. The main attributes are incident ID, incident category, description
of the incident, day, date, time and geographic data of the incident.
