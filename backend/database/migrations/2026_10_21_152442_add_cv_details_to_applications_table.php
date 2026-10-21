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
            $table->text('skills')->nullable()->after('study_program');
            $table->text('experience')->nullable()->after('skills');
            $table->text('projects')->nullable()->after('experience');
            $table->string('portfolio_url', 500)->nullable()->after('projects');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['skills', 'experience', 'projects', 'portfolio_url']);
        });
    }
};
