---
title: "Laravel create migration file in specific folder"
description: "Title: Efficiently Create Migration Files for Your Payment Package in Laravel using Custom Artisan Commands Introduction: Creating migration files is an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Efficiently Create Migration Files for Your Payment Package in Laravel using Custom Artisan Commands

Introduction:
Creating migration files is an important part of managing a database for your Laravel application. In some cases, you may need to create the migration scripts within a specific folder structure, such as when working with a package or module. This article will guide you through the process of creating custom artisan commands to achieve this goal.

Step 1: Create Folder Structure for Your Payment Package
Begin by organizing your payment package's files into an appropriate directory structure. Typically, it would be within the 'app/Payment/' folder to keep all related files and classes in one place. This includes creating a new folder named "Database" inside this path.

Step 2: Create a Simple Migration File as Example
Create a basic migration file under your newly created 'app/Payment/Database' directory, like "create_payment_table". This migration will contain the necessary code to create a table for storing payment information:

<pre><code>class CreatePaymentTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_id');
            // Add more columns as needed

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
</code></pre>

Step 3: Create a Custom Artisan Command for Migration File Generation
Create a new file named 'MakePaymentMigration.php' in the root of your Laravel application (usually within the 'app/' directory). This command will create migration files within the "packages/Payment/src/Database" folder, allowing you to easily manage migrations related specifically to your payment package:

<pre><code>class MakePaymentMigration extends Command
{
    use CreatesApplicationCommands;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:payment-migration {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new payment migration file within the "Payment" package.';

    public function handle()
    {
        $name = $this->argument('name');
        $namespace = config("app.namespace") . '\\Payment\\Database\\Migrations\\';
        $path = base_path("app/Payment/Database");

        if (!empty($name)) {
            // If a name is provided, create the migration file and its corresponding table.
            $this->call('make:migration', [
                '--table' => 'payments',
                '--create' => true,
                '--timestamps' => true,
            ]);
        } else {
            // If no name is provided, create an example migration file.
            $this->call('make:migration', [
                'name' => 'CreatePaymentTable',
                'table' => 'payments',
                '--create' => true,
                '--timestamps' => true,
            ]);
        }

        // Move the migration file to a specific folder.
        $this->command->call('migrate:refresh');
        $this->moveMigrationFile();
    }

    protected function moveMigrationFile()
    {
        copy(config('filesystems.disks.local.root') . '/database/migrations/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '.php', $path);
        copy(config('filesystems.disks.local.root') . '/database/migrations/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '_down.php', $path);
        rename(config('filesystems.disks.local.root') . '/database/migrations/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '.php', 'Payment/src/Database/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '_' . (strpos($this->argument('name'), '-') !== false ? explode('-', $this->argument('name'))[1] : 'default') . '.php');
        rename(config('filesystems.disks.local.root') . '/database/migrations/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '_down.php', 'Payment/src/Database/' . date('Y_m_d_His', time()) . '_' . strtolower(explode(' ', $this->argument('name'))[0]) . '_' . (strpos($this->argument('name'), '-') !== false ? explode('-', $this->argument('name'))[1] : 'default') . '_down.php');
    }
}
</code></pre>

Step 4: Run the Artisan Command and Test It
Run the command "php artisan make:payment-migration" to create a new migration file within your payment package's Database folder, following any desired table name you provide as an argument. You can now run migrations or rollback with proper commands while keeping all database changes specific to your payment package.

Conclusion:
In conclusion, this detailed guide has shown you how to effectively integrate the Laravel artisan commandline tool into your application for better management of migration files related to a Payment Package. This approach ensures efficient use of resources and makes maintenance much easier. Remember that these steps can be modified or extended according to your specific project requirements. To find out more about Laravel development, visit https://laravelcompany.com/blog.
