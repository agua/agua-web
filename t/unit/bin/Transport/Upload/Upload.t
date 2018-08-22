#!/usr/bin/perl -w

=head2
	
APPLICATION 	Upload.t

PURPOSE

	Test Web::Transport::Upload module
	
NOTES

	1. RUN AS ROOT
	
	2. BEFORE RUNNING, SET ENVIRONMENT VARIABLES, E.G.:
	
		export installdir=/aguadev

=cut

use Test::More 	tests => 32;
use Getopt::Long;
use FindBin qw($Bin);
use lib "$Bin/../../../lib";

BEGIN {
	print "\n\nMUST SET installdir ENVIRONMENT VARIABLE BEFORE RUNNING TESTS\n\n" and exit if not defined $ENV{'installdir'};

    my $installdir = $ENV{'installdir'};
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
    use_ok('Test::Web::Transport::Upload');
}
require_ok('Conf::Yaml');
require_ok('Test::Web::Transport::Upload');

#### SET CONF FILE
my $installdir  =   $ENV{'installdir'} || "/a";
my $configfile	=   "$installdir/conf/config.yml";

#### SET $Bin
$Bin =~ s/^.+\/bin/$installdir\/t\/bin/;

#### GET OPTIONS
my $logfile 	= "/tmp/testuser.upload.log";
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
    backup	    =>	0,
    memory	    =>	1,
    separator	=>	"\t",
    spacer	    =>	"\\s\+",
    logfile     =>  $logfile,
	log     =>  2,
	printlog    =>  2    
);
isa_ok($conf, "Conf::Yaml", "conf");

#### SET DUMPFILE
my $dumpfile    =   "$Bin/../../../../db/dump/infusion.dump";

my $uploader = new Test::Web::Transport::Upload(
    dumpfile    =>  $dumpfile,
    conf        =>  $conf,
    json        =>  {
        username    =>  'syoung'
    },
    username    =>  "test",
    project     =>  "Project1",
    uploader    =>  "Workflow1",
    logfile     =>  $logfile,
	log			=>	$log,
	printlog    =>  $printlog
);
isa_ok($uploader, "Test::Web::Transport::Upload", "uploader");

#### METHOD TESTS
$uploader->testSetData();
$uploader->testNextData();
$uploader->testGetBoundary();
$uploader->testParseFilename();
$uploader->testPrintTempfile();
$uploader->testParseParams();
$uploader->testNotifyStatus();

#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
#                                    SUBROUTINES
#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

sub usage {
    print `perldoc $0`;
}
