package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Daine on 11/24/2016.
 */
public class TravelTime extends AppCompatActivity
{
    private String inputFrom;
    private String inputTo;
    private TextView responseView;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        inputFrom = getIntent().getStringExtra("USER_FROM");
        inputTo = getIntent().getStringExtra("USER_TO");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.travel_time);

        responseView = (TextView)(findViewById(R.id.travelTimeTxt));
        AsyncTask th = new BackgroundThread().execute();
    }

    public void goBack(View v)
    {
        finish();
    }

    private void parse(String response)
    {
        if("There was an error".equalsIgnoreCase(response))
        {
            responseView.setText(response);
            return;
        }
        if("Please enter numbers for both".equalsIgnoreCase(response))
        {
            responseView.setText(response);
            return;
        }
        char isError = response.charAt(9);
        if(isError == 't')
        {
            responseView.setText("There was an error");
            return;
        }
        int i;
        String sub;
        for(i = 0; i < response.length() - 4; i++)
        {
            sub = response.substring(i, (i + 4));
            if("data".equals(sub)) {
                //response = sub;
                break;
            }
        }
        if(i == response.length() - 4)
        {
            responseView.setText("There was an error");
            return;
        }
        response = response.substring((i + 7), response.length());
        response = response.replaceAll("\"", "");
        response = response.replaceAll("\\}", "");
        response = response.replaceAll("\\{", "\n");
        response = response.replaceAll(",", "\n");
        response = response.replaceAll("\\[", "");
        response = response.replaceAll("\\]", "");
        responseView.setText(response);
        if(response.trim().equals(""))
        {
            responseView.setText("No information Found");
        }
        /*long unixSeconds = Long.parseLong(response);
        Date date = new Date(unixSeconds);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-4"));
        String formattedDate = sdf.format(date);
        responseView.setText(formattedDate);*/
        return;
    }

    public class BackgroundThread extends AsyncTask<Void, Void, String>
    {
        private Exception exception;

        protected void onPreExecute()
        {
            responseView.setText("Retreiving Information");
        }

        protected String doInBackground(Void... urls)
        {
            try{
                Integer.parseInt(inputFrom);
                Integer.parseInt(inputTo);
            }catch(NumberFormatException e)
            {
                // Do nothing (for now, might do something else with this later)
                return "Please enter numbers for both";
            }
            try{
                URL url = new URL(MainActivity.API_URL + "/stop/timeTotal?start=" +
                        inputFrom + "&stop=" + inputTo);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try{
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(
                            urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while((line = bufferedReader.readLine()) != null)
                    {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    return stringBuilder.toString();
                }
                finally{
                    urlConnection.disconnect();
                }
            } catch(Exception e) {
                Log.e("ERROR", e.getMessage(), e);
                return null;
            }
        }

        protected void onPostExecute(String response)
        {
            if(response == null)
            {
                response = "There was an error";
            }
            Log.i("INFO", response);
            parse(response);
        }
    }
}
