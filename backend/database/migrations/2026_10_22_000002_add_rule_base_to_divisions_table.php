<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('divisions', function (Blueprint $table) {
            $table->text('target_keywords')->nullable()->after('is_locked');
            $table->text('relevant_programs_high')->nullable()->after('target_keywords');
            $table->text('relevant_programs_medium')->nullable()->after('relevant_programs_high');
            $table->unsignedInteger('passing_threshold')->default(60)->after('relevant_programs_medium');
        });

        // Seed initial rule base for existing 6 divisions
        $defaults = [
            'Business and Development (BND)' => [
                'keywords' => 'bisnis, business, development, kemitraan, partnership, revenue, strategi, manajemen, b2b, kerjasama, marketing, sponsor',
                'high'     => 'manajemen bisnis, administrasi bisnis, bisnis digital, kewirausahaan, manajemen, ekonomi, ilmu ekonomi, manajemen pemasaran, bisnis internasional, bisnis, entrepreneurship, business, ekonomi pembangunan, manajemen keuangan, manajemen strategis, commerce, business administration, business management, digital business, international business, financial management, manajemen retail, retail management, adbis, bisnis kreatif, creative business, pengembangan bisnis, business development, manajemen bisnis telekomunikasi, mbti, e-commerce, perdagangan internasional, international trade, bisnis terapan, administrasi niaga, tata niaga, ekonomi bisnis',
                'medium'   => 'akuntansi, hubungan internasional, ilmu komunikasi, administrasi publik, administrasi negara, teknik industri, industrial engineering, sistem informasi, information systems, statistika, statistics, keuangan, perbankan, banking and finance, manajemen logistik, supply chain, ilmu administrasi, ekonomi syariah, perbankan syariah, manajemen operasional, sains data, data science, adpub, aktuaris, komunikasi bisnis, hukum bisnis, business law, manajemen informatika',
            ],
            'New Media' => [
                'keywords' => 'fotografi, videografi, dkv, video editing, konten, kreatif, desain grafis, jurnalis, reporter, kamera, sosial media, media digital, visual',
                'high'     => 'ilmu komunikasi, jurnalistik, jurnalisme, journalism, desain komunikasi visual, dkv, multimedia, fotografi, photography, broadcasting, penyiaran, sastra, sastra indonesia, sastra inggris, english literature, indonesian literature, animasi, animation, film dan televisi, film & televisi, film, televisi, media digital, digital media, periklanan, advertising, komunikasi massa, mass communication, creative writing, penulisan kreatif, desain grafis, graphic design, jurnalistik online, sinematografi, cinematography, produksi media, media rekam, seni media rekam, videografi, videography, video editing, motion graphic, content creation, ilkom, penerbitan, publishing, media massa, jurnalistik digital, komunikasi digital, creative media, desain media digital, komunikasi visual, visual communication',
                'medium'   => 'teknik informatika, sistem informasi, rekayasa perangkat lunak, rpl, seni rupa, fine arts, seni murni, desain produk, product design, sosiologi, sociology, bahasa, linguistik, linguistics, hubungan masyarakat, public relations, humas, manajemen komunikasi, sastra jepang, sastra arab, sastra perancis, pendidikan bahasa, antropologi, ilmu politik, tata kelola media, teknologi informasi, seni visual, pendidikan bahasa indonesia, pendidikan bahasa inggris, filsafat, studi media, media studies, copywriting',
            ],
            'On Air' => [
                'keywords' => 'siaran, radio, on air, broadcasting, penyiar, announcer, podcast, presenter, audio, sound, recording, naskah, wawancara, vokal',
                'high'     => 'broadcasting, penyiaran, penyiaran radio, radio, radio broadcasting, ilmu komunikasi, jurnalistik, jurnalisme, teater, seni teater, seni pertunjukan, performing arts, public relations, komunikasi penyiaran, presenter, announcing, announcer, seni drama tari dan musik, sendratasik, tata vokal, seni suara, seni musik, music, audio production, produksi siaran, voice over, ilkom, komunikasi penyiaran islam, kpi, public speaking, penyiar, broadcaster, voice talent, podcasting',
                'medium'   => 'sastra indonesia, sastra inggris, sastra, linguistik, bahasa dan sastra, hubungan masyarakat, humas, hukum, ilmu hukum, ilmu politik, psikologi, psychology, sosiologi, komunikasi massa, pariwisata, tourism, kreatif, pendidikan bahasa, pendidikan seni, seni media rekam, manajemen komunikasi, hubungan internasional, pendidikan bahasa indonesia, pendidikan bahasa inggris, studi budaya',
            ],
            'Marketing' => [
                'keywords' => 'marketing, pemasaran, sales, penjualan, iklan, advertising, sponsorship, campaign, digital marketing, klien, komersial, negosiasi',
                'high'     => 'manajemen pemasaran, marketing, marketing management, manajemen, ilmu komunikasi, bisnis digital, administrasi bisnis, periklanan, advertising, pemasaran, komunikasi pemasaran, marketing communication, marcomm, sales, penjualan, digital marketing, manajemen penjualan, business management, adbis, ilkom, brand management, manajemen bisnis, kewirausahaan, entrepreneurship, commercial management, strategic marketing',
                'medium'   => 'ekonomi, akuntansi, hubungan masyarakat, public relations, humas, statistika, psikologi, administrasi publik, administrasi negara, komunikasi bisnis, hubungan internasional, manajemen ritel, retail management, perbankan, keuangan, teknik industri, sains data, adpub, hukum bisnis, manajemen logistik, commerce',
            ],
            'Promotion' => [
                'keywords' => 'promosi, promotion, event, event organizer, branding, aktivasi merek, humas, public relations, publikasi, pameran, sponsorship, campaign',
                'high'     => 'periklanan, advertising, desain komunikasi visual, dkv, hubungan masyarakat, public relations, humas, ilmu komunikasi, event management, manajemen event, manajemen komunikasi, kreatif, promosi, brand management, marcomm, marketing communication, komunikasi pemasaran, creative advertising, manajemen promosi, ilkom, public relations and communications, media relations, aktivasi merek, brand activation, corporate communication',
                'medium'   => 'manajemen pemasaran, marketing, multimedia, pariwisata, tourism, hospitality, pariwisata dan perhotelan, seni rupa, desain grafis, sastra, administrasi bisnis, komunikasi massa, seni pertunjukan, teater, manajemen bisnis, sosiologi, adbis, broadcasting, manajemen seni, penataan acara',
            ],
            'Teknik' => [
                'keywords' => 'teknik, IT, jaringan, network, hardware, software, server, pemancar, audio engineering, transmisi, maintenance, elektro, troubleshooting',
                'high'     => 'teknik elektro, teknik telekomunikasi, teknik informatika, sistem informasi, teknik komputer, audio engineering, sound engineering, audio production, teknik radio, teknologi informasi, rekayasa perangkat lunak, teknik transmisi, teknik audio video, tav, mekatronika, elektronika, teknik elektronika, teknik komputer dan jaringan, tkj, rpl, computer science, information technology, electrical engineering, telecommunication engineering, broadcast engineering, sistem komputer, rekayasa sistem komputer, teknik informatika dan komputer',
                'medium'   => 'teknik fisika, teknik industri, multimedia, manajemen informatika, komputerisasi akuntansi, sains data, data science, teknik jaringan, network engineering, sains informasi, ilmu komputer, cyber security, keamanan siber, teknik otomasi, otomasi sistem industri, teknik mesin, instrumentasi, teknik mekatronika, telekomunikasi',
            ],
        ];

        foreach ($defaults as $divName => $data) {
            DB::table('divisions')
                ->where('name', $divName)
                ->update([
                    'target_keywords'          => $data['keywords'],
                    'relevant_programs_high'   => $data['high'],
                    'relevant_programs_medium' => $data['medium'],
                    'passing_threshold'        => 60,
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('divisions', function (Blueprint $table) {
            $table->dropColumn([
                'target_keywords',
                'relevant_programs_high',
                'relevant_programs_medium',
                'passing_threshold',
            ]);
        });
    }
};
