<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->boolean('r2_passed')->nullable()->after('r1_passed');
            $table->float('r2_score')->nullable()->after('r2_passed');
            $table->float('r4_score')->nullable()->after('r4_passed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['r2_passed', 'r2_score', 'r4_score']);
        });
    }
};
