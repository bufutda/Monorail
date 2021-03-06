package ca.mcnivenucalgary.daine.monorail;

import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeUnit;

/**
 * Created by Daine on 11/24/2016.
 */
public class SearchActivity extends AppCompatActivity
{
    private String input = "";
    private EditText editText;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
    }

    public void goBack(View v)
    {
        finish();
    }

    public void search(View v)
    {
        editText = (EditText)(findViewById(R.id.searchQueryField));
        input = editText.getText().toString();
        Intent intent = new Intent(this, Search.class);
        intent.putExtra("USER_INPUT", input);
        startActivity(intent);
    }
}
