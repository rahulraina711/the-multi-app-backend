const router = require('express').Router();
const fs = require('fs');

router.post("/", (req, res) =>{

    const {summary , description} = req.body

    const {google} = require('googleapis');

    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET );

    oAuth2Client.setCredentials({
        refresh_token: process.env.RFT,
    })
    const calendar = google.calendar({version: 'v3', auth:oAuth2Client})
    // eventStartTime = new Date().set;
    // eventStartTime.setDate(eventstartTime.getDay() + 2);

    // const eventEndTime = newDate();
    // eventEndTime.setDate(eventendTime.getDay() + 2);
    // eventEndTime.setMinutes(eventEndTime.getMinutes() + 60)

    var event = {
        'summary': summary,
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': description,
        'start': {
          'dateTime': '2015-05-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': '2015-05-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'lpage@example.com'},
          {'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        }
      };
      

    calendar.freebusy.query({
        resource: {
            timeMin: eventStartTime,
            tmeMax: eventEndTime,
            items: [{id: 'primary'}]
        }
    }, (err, res)=>{
        if(err) return console.log('I m busy' , err)

        const eventArr = res.data.calendars.primary.busy;
        if(eventArr.length===0){
            return calendar.events.insert({
                calendarId:'primary', resource: event
            }, err=>{
                if (err) return console.log("error", err);
                return console.log('Event created');
            })
            
        }
        return console.log('sorry schedule is');
        
    })
});

module.exports = router