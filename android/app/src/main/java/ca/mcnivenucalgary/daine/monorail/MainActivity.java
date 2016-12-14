package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity
{
    public static final String API_URL = "https://sa.watz.ky/monorail/api";
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void delayActivity(View v)
    {
        Intent intent = new Intent(this, DelayActivity.class);
        startActivity(intent);
    }

    public void routeActivity(View v)
    {
        Intent intent = new Intent(this, RouteActivity.class);
        startActivity(intent);
    }

    public void stopsActivity(View v)
    {
        Intent intent = new Intent(this, StopsActivity.class);
        startActivity(intent);
    }

    public void vehicleActivity(View v) {
        Intent intent = new Intent(this, VehicleActivity.class);
        startActivity(intent);
    }
}


