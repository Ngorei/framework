<?php
namespace package;
use app\element\SelectOption;

// Kemudian di bagian HTML
$content = '<selectop label="Gender" id="gender" name="gender" content="(
    <option value="">Select gender...</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
)"/>';

echo SelectOption::transform($content); 