<?php ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./assets/main.css">
    <title><?= $site -> title() -> html() ?></title>
    <?php snippet( 'meta', [
        'title' => $site -> title() -> html(),
        'url' => kirby() -> urls() -> index(),
        // 'description' => page('home') -> description() -> html(),
        // 'image' => page('home') -> mainImage() -> isNotEmpty()
        //   ? page('home') -> mainImage() -> toFile() -> url()
        //   : null
      ]) ?>
</head>
<body>
    <main></main>
    <script src="./assets/main.js"></script>
</body>
</html>