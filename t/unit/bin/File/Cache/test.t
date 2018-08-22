#!/usr/bin/perl -w

use Test::More 	tests => 3;
use Getopt::Long;

use FindBin qw($Bin);
use lib "$Bin/../../../../lib";
BEGIN
{
    my $installdir = $ENV{'installdir'} || "/a";
    unshift(@INC, "$installdir/extlib/lib/perl5");
    unshift(@INC, "$installdir/extlib/lib/perl5/x86_64-linux-gnu-thread-multi/");
    unshift(@INC, "$installdir/lib");
    unshift(@INC, "$installdir/lib/external/lib/perl5");
}

#### CREATE OUTPUTS DIR
my $outputsdir = "$Bin/outputs";
`mkdir -p $outputsdir` if not -d $outputsdir;


BEGIN {
    use_ok('Test::Web::File::Cache');
}
require_ok('Test::Web::File::Cache');

#### SET CONF FILE
my $installdir  =   $ENV{'installdir'} || "/a";
my $configfile    =   "$installdir/conf/config.yml";

#### SET $Bin
$Bin =~ s/^.+t\/bin/$installdir\/t\/bin/;

my $logfile     =   "$Bin/outputs/file.log";
my $log     =   2;
my $printlog    =   5;
my $help;
GetOptions (
    'log=i'     => \$log,
    'printlog=i'    => \$printlog,
    'help'          => \$help
) or die "No options specified. Try '--help'\n";
usage() if defined $help;

my $conf = Conf::Yaml->new(
	inputfile	=>	$configfile,
	backup		=>	1,
	separator	=>	"\t",
	spacer		=>	"\\s\+",
    logfile     =>  $logfile,
    log			=>	$log,
    printlog    =>  $printlog
);

my $username	=	$conf->getKey("database", "TESTUSER");

my $object = Test::Web::File::Cache->new(
    conf        =>  $conf,
    logfile     =>  $logfile,
    log			=>	$log,
    printlog    =>  $printlog,
	username	=>	$username
);
isa_ok($object, "Test::Web::File::Cache");


###### TO DO :
##$object->testFileJson();

#### ONWORKING checkEbwt
#$object->testCheckEbwt();

#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
#                                    SUBROUTINES
#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

sub usage {
    print `perldoc $0`;
}

