package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;

/**
 * Created by Daine on 11/24/2016.
 */
public class VehicleActivity extends AppCompatActivity
{
    private String input = "";
    private EditText editText;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vehicle);
    }

    public void goBack(View v)
    {
        finish();
    }

    public void vehicleInfo(View v)
    {
        editText = (EditText)(findViewById(R.id.vehicleInfoField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, VehicleInfo.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }

    public void routesForType(View v)
    {
        editText = (EditText)(findViewById(R.id.routesForTypeField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, RoutesForType.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }
}
