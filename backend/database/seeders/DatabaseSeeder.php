<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ─── Admin User ────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@suarasurabaya.net'],
            [
                'name'     => 'Admin Suara Surabaya',
                'password' => 'password123',
                'role'     => 'admin',
                'phone'    => '031-1234567',
            ]
        );

        // ─── Head / Pimpinan ───────────────────────────
        User::firstOrCreate(
            ['email' => 'pimpinan@suarasurabaya.net'],
            [
                'name'     => 'Pimpinan Redaksi',
                'password' => 'password123',
                'role'     => 'head',
                'phone'    => '031-7654321',
            ]
        );

        // ─── Sample Applicant ──────────────────────────
        User::firstOrCreate(
            ['email' => 'ahmad.fauzi@student.ac.id'],
            [
                'name'             => 'Ahmad Fauzi',
                'password'         => 'password123',
                'role'             => 'applicant',
                'applicant_type'   => 'mahasiswa',
                'institution_name' => 'UIN Sunan Ampel Surabaya',
                'phone'            => '081234567890',
            ]
        );

        // ─── Divisions Suara Surabaya Media ─────────────
        $divisions = [
            ['name' => 'Business and Development (BND)', 'max_quota' => 5],
            ['name' => 'New Media',                     'max_quota' => 8],
            ['name' => 'On Air',                        'max_quota' => 4],
            ['name' => 'Marketing',                     'max_quota' => 4],
            ['name' => 'Promotion',                     'max_quota' => 4],
            ['name' => 'Teknik',                        'max_quota' => 4],
        ];

        foreach ($divisions as $division) {
            Division::firstOrCreate(
                ['name' => $division['name']],
                ['max_quota' => $division['max_quota']]
            );
        }
    }
}
