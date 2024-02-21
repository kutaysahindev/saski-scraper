# Water Outage Warning System

This Node.js application functions as a Water Outage Warning System, diligently scraping the official public data from Samsun Water and Sewerage Administration (SASKI) website for outage alerts in chosen neighborhoods. When new warnings emerge, the system promptly sends SMS notifications via Twilio. Deployed on Heroku Cloud, it operates continuously to provide uninterrupted service.

## Example Output(SMS)

<img width="335" alt="image" src="https://github.com/kutaysahindev/saski-scraper/assets/79334889/ec5e01f2-4a23-43f9-8d3b-9c3819eb6d5e">

## How to use

1. Clone the repository and navigate to the project folder.
2. Install the required packages by running `npm install`.
3. Create a `.env` file in the root of the project and add the following environment variables:

   ```
   ACCOUNT_SID=your_twilio_account_sid
   AUTH_TOKEN=your_twilio_auth_token
   PHONE_NUMBER=your_twilio_phone_number
   MY_PHONE_NUMBER=your_phone_number
   ```

4. Run the application with `node app.js`.
5. The application will check for new warnings every 5 minutes and send an SMS to the specified phone number if there are any new warnings.

## Deployment on Heroku

This application has been deployed on Heroku, ensuring it runs 24/7. The deployment on Heroku allows continuous monitoring of water outage warnings without the need for manual intervention.

## Technologies

- Node.js
- Axios
- Cheerio
- Twilio
- Heroku
