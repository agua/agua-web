#!/usr/bin/perl -w

=head2
	
APPLICATION 	Request.t

PURPOSE

	Test Web::Request module
	
NOTES

	1. RUN AS ROOT
	
	2. BEFORE RUNNING, SET ENVIRONMENT VARIABLES, E.G.:
	
		export installdir=/aguadev

=cut

use Test::More 	tests => 26;
use Getopt::Long;
use FindBin qw($Bin);
use lib "$Bin/../../../lib";
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
    use_ok('Conf::Yaml');
    use_ok('Test::Web::Request');
}
require_ok('Conf::Yaml');
require_ok('Test::Web::Request');

#### SET CONF FILE
my $installdir  =   $ENV{'installdir'} || "/a";
my $urlprefix  =   $ENV{'urlprefix'} || "agua";
my $configfile	=   "$installdir/conf/config.yml";
#print "Installer.t    configfile: $configfile\n";

#### SET $Bin
$Bin =~ s/^.+\/bin/$installdir\/t\/unit\/bin/;

#### GET OPTIONS
my $logfile 	= "/tmp/testuser.login.log";
my $log     =   2;
my $printlog    =   5;
my $help;
GetOptions (
    'log=i'     => \$log,
    'printlog=i'    => \$printlog,
    'logfile=s'     => \$logfile,
    'help'          => \$help
) or die "No options specified. Try '--help'\n";
usage() if defined $help;

my $conf = Conf::Yaml->new(
    inputfile	=>	$configfile,
    backup	    =>	1,
    separator	=>	"\t",
    spacer	    =>	"\\s\+",
    logfile     =>  $logfile,
	log     =>  2,
	printlog    =>  5    
);
isa_ok($conf, "Conf::Yaml", "conf");

#### SET DUMPFILE
my $dumpfile    =   "$Bin/../../../../dump/create.dump";

my $object = new Test::Web::Request(
    conf        =>  $conf,
    logfile     =>  $logfile,
	log			=>	$log,
	printlog    =>  $printlog
);
isa_ok($object, "Test::Web::Request", "object");

#### TESTS
$object->testGetQueries();
$object->testAddQuery();
$object->testRemoveQuery();
$object->testGetDownloads();
$object->testAddDownload();
$object->testRemoveDownload();

#### SATISFY Util::Main::Logger::logError CALL TO EXITLABEL
no warnings;
EXITLABEL : {};
use warnings;

#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
#                                    SUBROUTINES
#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

sub usage {
    print `perldoc $0`;
}

