![Hackathon Logo](docs/images/hackathon.png?raw=true "Hackathon Logo")
# Sitecore Hackathon 2021 - FitCropper Documentation

## Team name: 
SitecoreInsiders

## Category: 
The best enhancement to SXA

## Enhacement description

Feature name: FitCropper

This module has the purpose of automatically resizing images through the Image Dimensions field in order to serve the image with the same sizes
This feature solves the problem of loading to the client the image with a size and weight unnecessary, decreasing the performance of the page.

## Technical description
The technical approach was divided in multiple sections:
- Ribbon button display and action
  - In order to display a new button, it was created some configurations in the Core Database
  - The action will trigger a confirmation modal, that when accepted, will trigger a javascript action
- The javascript section processes the image size and calls a backend method to override the dimensions of the image

## Pre-requisites and Dependencies
- Sitecore Experience Accelerator (SXA)

## Installation instructions
To install the FitCropper all you need to do is to use the Sitecore Installation wizard to install the provided package.

## Usage instructions:
In order to use this feature you need to:
1.	Open the Experience Editor
2.	Add the component	“Image” to the main placeholder
3.	Click on the image component 
4.	Click on the FitCropper button (check image bellow)
5.	The image should be resized to its native size


## Overall usage
To use this feature we have two buttons, one on the Experience Editor ribbon and the other on the image component itself, these same buttons have different behaviors.
The following button on the ribbon will re-image all the images on the respective page

![img1](https://github.com/Sitecore-Hackathon/2021-SitecoreInsiders/blob/main/docs/images/button%20ribbon.png "Example 1")
![img2](https://github.com/Sitecore-Hackathon/2021-SitecoreInsiders/blob/main/docs/images/button%20rendering%20component.png "Example 2")
![img3](https://github.com/Sitecore-Hackathon/2021-SitecoreInsiders/blob/main/docs/images/message%20alert.png "Example 3")

## Video Link (Replace with video link)
