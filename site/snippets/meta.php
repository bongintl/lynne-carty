<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary">
<?php if ( isset( $title ) ) : ?>
    <meta property="og:title" content="<?= $title ?>" />
    <meta name="twitter:title" content="<?= $title ?>">
<?php endif; if ( isset( $url ) ) : ?>
    <meta property="og:url" content="<?= $url ?>" />
    <meta name="twitter:url" content="<?= $url ?>">
<?php endif; if ( isset( $description ) ) : ?>
    <meta property="og:description" content="<?= $description ?>" />
    <meta name="twitter:description" content="<?= $description ?>">
<?php endif; if ( isset( $image ) ) : ?>
    <meta property="og:image" content="<?= $image ?>" />
    <meta name="twitter:image" content="<?= $image ?>">
<?php endif; ?>