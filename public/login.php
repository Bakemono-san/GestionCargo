<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cargo Monde Login</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .glassmorphism {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        
        body {
            background: url('https://images.unsplash.com/photo-1581091012184-cb28f0da75ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center fixed;

            background-size: cover;
        }
    </style>
</head>

<body class="min-h-screen flex items-center justify-center bg-gray-200 bg-opacity-50">
    <div class="glassmorphism p-8 max-w-md w-full">
        <div class="text-center mb-6">
            <h1 class="text-4xl font-bold text-gray-700 mt-4">Cargo Monde</h1>
        </div>
        <form action="." method="POST" class="space-y-6">
        <?php if (!empty($error)): ?>
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline"><?php echo $error; ?></span>
                </div>
            <?php endif; ?>
            <input type="hidden" name="login">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <input id="email" name="email" type="email" required class="mt-1 block w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input id="password" name="password" type="password" required class="mt-1 block w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
            </div>

            <div class="flex items-center justify-between">
                <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">Forgot your password?</a>
                </div>
            </div>
            <div>
                <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    Sign in
                </button>
            </div>
        </form>
        
    </div>
</body>

</html>
