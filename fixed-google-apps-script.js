// Fixed Google Apps Script - Remove setHeaders calls
// Replace your entire Apps Script code with this

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
    }

    var sheet = SpreadsheetApp.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Poll ID','Response','Question','Category','Session ID',
        'User Country','User State','User City','Latitude','Longitude',
        'Timezone','IP Address','Country Code','Region Code','User Agent','Language'
      ]);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.pollId || 'unknown',
      data.response || 'no_response',
      data.question || 'no_question',
      data.category || 'no_category',
      data.sessionId || 'no_session',
      data.userCountry || 'unknown',
      data.userState || 'unknown',
      data.userCity || 'unknown',
      data.latitude || 'unknown',
      data.longitude || 'unknown',
      data.timezone || 'unknown',
      data.ip || 'unknown',
      data.countryCode || 'unknown',
      data.regionCode || 'unknown',
      data.userAgent || 'unknown',
      data.language || 'unknown'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var values = sheet.getDataRange().getValues(); // headers + data
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        totals: { visitors: 0, countries: 0, pollsCompleted: 0 },
        voters: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = values[0];
    var rows = values.slice(1);

    var idx = {};
    ['Timestamp','Poll ID','Session ID','User Country','User State','User City','Latitude','Longitude']
      .forEach(function(h){ idx[h] = headers.indexOf(h); });

    var sessionToFirst = {};
    var sessionToCountry = {};
    var sessionToLoc = {};

    rows.forEach(function(r) {
      var sid = r[idx['Session ID']] || 'no_session';
      var ts = r[idx['Timestamp']] || '';
      var country = r[idx['User Country']] || 'unknown';
      var state = r[idx['User State']] || 'unknown';
      var city = r[idx['User City']] || 'unknown';
      var lat = r[idx['Latitude']];
      var lon = r[idx['Longitude']];

      if (!sessionToFirst[sid] || ts < sessionToFirst[sid]) sessionToFirst[sid] = ts;
      sessionToCountry[sid] = country;
      sessionToLoc[sid] = {
        sessionId: sid,
        country: country,
        state: state,
        city: city,
        latitude: (lat === '' || lat === 'unknown') ? null : Number(lat),
        longitude: (lon === '' || lon === 'unknown') ? null : Number(lon),
        firstVoteAt: sessionToFirst[sid]
      };
    });

    var uniqueSessions = Object.keys(sessionToFirst);
    var countriesSet = {};
    uniqueSessions.forEach(function(sid){ countriesSet[sessionToCountry[sid] || 'unknown'] = true; });

    var result = {
      totals: {
        visitors: uniqueSessions.length,
        countries: Object.keys(countriesSet).length,
        pollsCompleted: rows.length
      },
      voters: Object.keys(sessionToLoc).map(function(sid){ return sessionToLoc[sid]; })
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      totals: { visitors: 0, countries: 0, pollsCompleted: 0 },
      voters: [],
      error: err.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
