# Airmee Serverless

## Pre Requests

- Postgres >= 9.6
- NodeJS >= 4.0.4 - Serverless (latest)

Start off by having a local Postgres instance boot up and run the init.sql script sent to you in this email.

## Main tables:

- admin.vendor_stores - stores general info for each retailer for which Airmee offers services

- admin.working_schedules - the working schedule per day for each retailer

- service.areas - a list of areas for which Airmee can offer services (this contains the union of all areas)
  service.schedules_and_prices - stores delivery schedules and prices

## Tasks

### Database

1. Retrieve a list of available schedules for the next week for a given retailer, area and timestamp Should return the
   pickup earliest time in unix timestamp in milliseconds, pickup latest time in unix timestamp in milliseconds, a human
   readable version of the pickup interval (e.g., "27 Aug 8:00- 12:00"), dropoff earliest time in unix timestamp in
   milliseconds, dropoff latest time in unix timestamp in milliseconds, a human readable version of the dropoff
   interval.

2. How would you add a different schedule logic for each area - e.g., all Stockholm deliveries can be delivered earliest
   same day, all Gothenburg deliveries can be delivered earliest next day

3. How would you add specific working times for each retailer and delivery times for Airmee for holidays? - for
   simplicity only consider 24, 25, 31 Dec and 1 Jan as holidays.

### API

4. For point 1, build an API endpoint prototype in NodeJS with Serverless. 5. Build a set of unit tests for the
   specified API endpoint.
6. What edge cases can you identify?

## Deliverables

- A SQL file that migrates the db generated after running the init.sql to support all the functions and features
  described in the tasks above.

- An archive of the Serverless project with instructions on how to deploy.

- Documentation for both sql and js files.