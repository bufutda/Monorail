package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;

/**
 * Created by Daine on 11/24/2016.
 */
public class StopsActivity extends AppCompatActivity
{
    private String input = "";
    private EditText editText;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_stops);
    }

    public void goBack(View v)
    {
        finish();
    }

    public void vehicleTypesFromStopNum(View v)
    {
        editText = (EditText)(findViewById(R.id.typeFromStopField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, TypesFromStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void previousStop(View v)
    {
        editText = (EditText)(findViewById(R.id.prevStopField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, PreviousStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void nextStop(View v)
    {
        editText = (EditText)(findViewById(R.id.nextStopField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, NextStop.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void stopInfo(View v)
    {
        editText = (EditText)(findViewById(R.id.stopInfoField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, StopInfo.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void travelTime(View v)
    {
        Intent intent = new Intent(this, TravelTime.class);
        editText = (EditText)(findViewById(R.id.timeStopsFromField));
        input = editText.getText().toString();
        intent.putExtra("USER_FROM", input);
        editText = (EditText)(findViewById(R.id.timeStopsToField));
        input = editText.getText().toString();
        intent.putExtra("USER_TO", input);
        startActivity(intent);
    }
}
