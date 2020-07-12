# Testing in TypeScript Workshop

In this workshoup we will learn about the different aspects of testing code in typescript, we will have a focus on frontend testing using react but we will cover more details that represent the generic topic of testing. Because typescript is a statically type language we will also go through a set of potential approaches to encode as many informations as possible at the type level to redue the need to test and to make test easier. We will also go through a set of potential soutions that drive app-level design choices as part of the process trying to maximise the efficiency of the typescript compiler.

## Material

The material is organized by day, we start at day-1 and each directory should be self driving, worth to say that the material is extremely new and so expect some mistakes here and there.

## Topics

- day 1: configs & monorepo structure for typescript testing
- day 2: unit testing using jest & testing-library
- day 3: testable code, we solve some of the issues discussed in the previous day. we further discuss integration testing and think about potential react architecture to make integration tests easier.
- day 4: continuing on the topic of integration testing we discuss the topic of data validation analizying potential solutions to ensure the runtime types are in line with what we expect when dealing with data that is outside the boundary of our app (example: an api call). We introduce the topic of generative testing.
- day 5: we introduce the topic of end to end testing and we go through the details of cypress as an end to end test runner, the setup will be slightly annoying (nothing compared to selenium) but the result is impressive, in fact with cypress we can get cross-browser testing that are both unit-level at the level of a single react component and both of an external app of which we don't have the code of.

## General Infos

The workshop has to be interactive, we will start with a slightly boring topic that is configuration and in that the exercises are not so exiting but for the rest you will be required to come up with solutions. Ideally for each exercise you will give it a try first before we go though it toghether to better understand the topic.

Other infos are:

- We take small breaks ideally 5/10mins every hour.
- Q&A should be interactive during the workshop, there are no planned q&a slots.
- In in person worshops I would be able to walk by you and share a view on the screen to discuss ideas and problems, let's try to do that here too
