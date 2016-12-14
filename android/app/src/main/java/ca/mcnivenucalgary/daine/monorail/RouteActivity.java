package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;

/**
 * Created by Daine on 11/24/2016.
 */
public class RouteActivity extends AppCompatActivity
{
    private String input = "";
    private EditText editText;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_route);
    }

    public void goBack(View v)
    {
        finish();
    }

    public void vehicleTypesFromRoute(View v)
    {
        editText = (EditText)(findViewById(R.id.typeFromRouteField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, VehicleTypesFromRoute.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void allRoutes(View v)
    {
        Intent intent = new Intent(this, AllRoutes.class);
        startActivity(intent);
    }

    public void firstStop(View v)
    {
        editText = (EditText)(findViewById(R.id.firstStopOfRouteField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, FirstStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void lastStop(View v)
    {
        editText = (EditText)(findViewById(R.id.lastStopOfRouteField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, LastStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void routeFromStop(View v)
    {
        editText = (EditText)(findViewById(R.id.routeFromStopField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, RouteFromStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void stopsFromRoute(View v)
    {
        editText = (EditText)(findViewById(R.id.allStopsFromRouteField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, StopsFromRoute.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }
}
