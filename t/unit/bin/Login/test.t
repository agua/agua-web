#!/usr/bin/perl -w

=head2
	
APPLICATION 	Common::Login.t

PURPOSE

	Test Web::Login module
	
NOTES

	1. RUN AS ROOT
	
	2. BEFORE RUNNING, SET ENVIRONMENT VARIABLES, E.G.:
	
		export installdir=/aguadev

=cut

use Test::More 	tests => 8;
use Getopt::Long;
use FindBin qw($Bin);
use lib "$Bin/../../../../lib";
BEGIN
{
    my $installdir = $ENV{'installdir'} || "/a";
    unshift(@INC, "$installdir/extlib/lib/perl5");
    unshift(@INC, "$installdir/extlib/lib/perl5/x86_64-linux-gnu-thread-multi/");
    unshift(@INC, "$installdir/lib");
}

#### CREATE OUTPUTS DIR
my $outputsdir = "$Bin/outputs";
`mkdir -p $outputsdir` if not -d $outputsdir;

BEGIN {
    use_ok('Conf::Yaml');
    use_ok('Test::Common::Login');
}
require_ok('Conf::Yaml');
require_ok('Test::Common::Login');

#### SET CONF FILE
my $installdir  =   $ENV{'installdir'} || "/a";
my $configfile	=   "$installdir/conf/config.yml";

#### SET $Bin
$Bin =~ s/^.+\/bin/$installdir\/t\/unit\/bin/;

#### GET OPTIONS
my $logfile 	= "/tmp/testuser.login.log";
my $log     =   2;
my $PRINTLOG    =   5;
my $help;
GetOptions (
    'log=i'     => \$log,
    'PRINTLOG=i'    => \$PRINTLOG,
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
	PRINTLOG    =>  5    
);
isa_ok($conf, "Conf::Yaml", "conf");

#### SET DUMPFILE
my $dumpfile    =   "$installdir/bin/sql/dump/agua/agua.dump";

#### SET DBTYPE
my $dbtype = "MySQL";

my $object = new Test::Common::Login(
    conf        =>  $conf,
    dbtype     	=>  $dbtype,
    logfile     =>  $logfile,
    dumpfile    =>  $dumpfile,
	log			=>	$log,
	PRINTLOG    =>  $PRINTLOG
);
isa_ok($object, "Test::Common::Login", "object");

#### TESTS
$object->testSubmitLogin();

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

