<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@gmail.com'],
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'password' => bcrypt('password'),
                'role' => 'super admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin Utama',
                'username' => 'admin',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'zakat@gmail.com'],
            [
                'name' => 'Panitia Zakat',
                'username' => 'zakat',
                'password' => bcrypt('password'),
                'role' => 'zakat',
            ]
        );

        User::updateOrCreate(
            ['email' => 'qurban@gmail.com'],
            [
                'name' => 'Panitia Qurban',
                'username' => 'qurban',
                'password' => bcrypt('password'),
                'role' => 'qurban',
            ]
        );
    }
}
