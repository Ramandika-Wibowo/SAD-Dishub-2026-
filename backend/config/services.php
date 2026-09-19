<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Storage Configuration (Lokal)
    |--------------------------------------------------------------------------
    */

    'local_storage' => [
        'disk'   => env('FILESYSTEM_DISK', 'public'),
        'folder' => 'documents',
    ],

    /*
    |--------------------------------------------------------------------------
    | Algorithm Configuration
    |--------------------------------------------------------------------------
    */

    'algorithm' => [
        'score_threshold' => env('ALGORITHM_SCORE_THRESHOLD', 60),
    ],

];
